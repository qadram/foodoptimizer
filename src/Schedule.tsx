import React, { Component } from 'react';
import Inventory from './Inventory';
import MealList from './MealList';
import MealPlan from './MealPlan';
import InventoryItem from './InventoryItem';
import Meal from './Meal';
import Menu from './Menu';
import MealSchedule from './MealSchedule';
import People, { Person } from './People';
import { withGoogleSheets } from 'react-db-google-sheets';


export type ScheduleProps = {
}

export type ScheduleState = {
    data: any;
}

class Schedule extends Component<ScheduleProps, ScheduleState> {

    state = {
        data: null,
    };


    async readFile(filepath: string) {
        let response = await fetch(filepath);
        return (response.text());
    }

    public loginfo: any;

    public log(...args: any[]) {
        args.forEach(argument => {
            // this.loginfo += <tr><td>{argument}</td></tr>;
            // this.log(argument);
        });
    }



    // eslint-disable-next-line react/require-render-return
    async componentDidMount() {
        let startdate = "2020/04/04";
        let enddate = "2020/04/26";


        let inventory: Inventory = new Inventory();
        //@ts-ignore
        inventory.importFromArray(this.props.db.Inventory);

        let meallist: MealList = new MealList();
        //@ts-ignore
        meallist.importFromArray(this.props.db.Meals);
        console.log('meallist: ', meallist);

        const mealplan: MealPlan = new MealPlan();
        //@ts-ignore
        mealplan.importFromArray(this.props.db.MealPlan);

        const people: People = new People();
        //@ts-ignore
        people.importFromArray(this.props.db.People);

        let warnings: Array<string> = [];

        let inventoryamountwarnings: Array<string> = [];

        //Sort inventory to find out what are the items that needed to be consumed first
        inventory.items.sort((item1: InventoryItem, item2: InventoryItem): number => {
            let datea = Date.parse(item1.bestbefore);
            let dateb = Date.parse(item2.bestbefore);
            if (datea > dateb) return (1);
            else if (datea === dateb) return (0);
            else if (datea < dateb) return (-1);
            return (0);
        })


        console.log('inventory: ', inventory);

        //TODO: At this moment, it doesnt test to consume the same meal on the same day!!! :-(
        //TODO: Inventory should be removed when the meal is assigned to an specific person/day
        //TODO: Maybe it's not a one-pass, second-pass, but a single-pass in which the meal is validated, assigned, and removed from the inventory, so it cannot be validated again
        //Iterate inventory to find out valid meals for the food that expired first
        const mealcandidates: Array<Meal> = [];
        inventory.items.forEach((item: InventoryItem) => {
            //Find all meals that use this food
            let food = item.food;
            // this.log('food: ', food);
            let validmeals: Array<Meal> = [];
            let amountissue: boolean = false;
            meallist.items.forEach((meal: Meal) => {
                if (meal.contains(food)) {
                    // this.log(food.name);
                    //A valid meal should be considered valid if there is inventory for that food, and for the rest of ingredients
                    //TODO: While there are ingredientes for the meal in the inventory, must be added!!!
                    // while (!amountissue) {
                    if (inventory.hasIngredientsFor(meal)) {
                        //Subtract from inventory
                        inventory.removeIngredientsOf(meal);
                        validmeals.push(meal);
                    }
                    else {
                        amountissue = true;
                        console.log(`⚠️ Warning!!: A meal was found for ${food.name} but there is not enough amount in inventory: ` + meal.name);
                        inventoryamountwarnings.push(`⚠️ Warning!!: A meal was found for ${food.name} but there is not enough amount in inventory: ` + meal.name);
                    }
                    // }
                }
            });
            //TODO: Try to space equal meals, to prevent eating every day the same
            //TODO: Add a best before date to the mean, which is the minimum best before date between all its ingredients
            //TODO: Add "type" to meal, to help in the schedule (breakfast, lunch, dinner, etc)
            //TODO: Add "age" to meal, to specify if it's a meal for child, adult, both
            //TODO: Implement Person, to specify what each person will eat on the meal schedule
            //TODO: Ban foods for a person, that is, specific people that won't eat an specific meal
            validmeals.forEach(validmeal => {
                mealcandidates.push(validmeal);

            });
            if (validmeals.length === 0) {
                if (!amountissue) {
                    warnings.push(`⚠️ Warning!!: No valid meal that includes ${food.name}`);
                }

            }
        });

        console.log('mealcandidates: ', mealcandidates);
        let istartdate = Date.parse(startdate);
        let ienddate = Date.parse(enddate);

        let mealschedule: Map<string, Array<MealPlan>> = new Map();

        //Iterate through the dates period
        for (let index = istartdate; index < ienddate; index += (24 * 3600000)) {
            let d = new Date(index);
            let mealplans: Array<MealPlan> = [];

            people.items.forEach((person: Person) => {
                //Setup a meal plan for the current date, with the goal of filling it with valid meals
                let todaysplan: MealPlan = new MealPlan();
                todaysplan.clone(mealplan);
                todaysplan.person = person.name;
                //Iterate through all the menus for the day
                todaysplan.items.forEach((menu: Menu) => {
                    menu.items.forEach((type: string, menuindex: number) => {
                        let index = -1;
                        if (mealcandidates.some((meal: Meal, k: number): boolean => {
                            if ((meal.when === menu.name) && (meal.type === type) && ((meal.age === person.age) || (meal.age === 'Both'))) {
                                //If it's a meal for an specific person, then, check it
                                if (meal.person !== '') {
                                    if (meal.person !== person.name) {
                                        return (false);
                                    }
                                }
                                index = k;
                                return (true);
                            }
                            else return (false);
                        })) {
                            let validmeal = mealcandidates[index];
                            menu.items[menuindex] = validmeal.name;
                            mealcandidates.splice(index, 1);
                        }
                        else {
                            menu.items[menuindex] = `⚠️ ${type}`;
                        }
                    });
                });
                mealplans.push(todaysplan);
            });

            mealschedule.set(d.toDateString(), mealplans);


        }

        console.log('mealschedule: ', mealschedule);
        //TODO: For each day, we have to fill the meal plan with information from the meal candidates
        this.log('mealschedule: ', mealschedule);
        this.log('mealcandidates: ', mealcandidates);

        let totalwarnings = warnings.concat(inventoryamountwarnings);

        this.setState({ data: <MealSchedule schedule={mealschedule} warnings={totalwarnings} /> });


        //TODO: Iterate from today until end date, day by day
        //TODO: 
        //TODO: Iterate through all the inventory, sorted by date, ascending
        //TODO: For every item in the 
    }

    render() {
        if (this.state.data === null) {
            return (<div>loading....</div>)
            // return(<div>{this.props.db.Inventory.map(data => (
            //     <span>{data.id}</span>
            //   ))}</div>);
        }
        else {
            return (<div><table><tbody>{this.state.data}</tbody></table></div>)
        }
    }
}

export default withGoogleSheets(['Inventory', 'Meals', 'MealPlan', 'People'])(Schedule);
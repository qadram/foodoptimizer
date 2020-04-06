import React, { Component } from 'react';
import Inventory from './Inventory';
import MealList from './MealList';
import MealPlan from './MealPlan';
import InventoryItem from './InventoryItem';
import Meal from './Meal';
import Menu from './Menu';
import MealSchedule from './MealSchedule';
import People, { Person } from './People';


export type ScheduleProps = {
}

export type ScheduleState = {
    data: any;
}



export default class Schedule extends Component<ScheduleProps, ScheduleState> {

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
        let inventorycsvfile = require('./inventory.csv');
        let inventorycsv = await this.readFile(inventorycsvfile);

        let mealscsvfile = require('./meals.csv');
        let mealscsv = await this.readFile(mealscsvfile);

        let mealplanfile = require('./mealplan.csv');
        let mealplancsv = await this.readFile(mealplanfile);

        let peoplefile = require('./people.csv');
        let peoplefilecsv = await this.readFile(peoplefile);


        let startdate = "2020/04/04";
        let enddate = "2020/04/06";
        let inventory: Inventory = new Inventory();
        await inventory.import(inventorycsv);

        let meallist: MealList = new MealList();
        await meallist.import(mealscsv);

        const mealplan: MealPlan = new MealPlan();
        await mealplan.import(mealplancsv);

        const people: People = new People();
        await people.import(peoplefilecsv);


        let warnings: Array<string> = [];



        //Sort inventory to find out what are the items that needed to be consumed first
        inventory.items.sort((item1: InventoryItem, item2: InventoryItem): number => {
            let datea = Date.parse(item1.bestbefore);
            let dateb = Date.parse(item2.bestbefore);
            if (datea > dateb) return (1);
            else if (datea === dateb) return (0);
            else if (datea < dateb) return (-1);
            return (0);
        })


        this.log('inventory: ', inventory);
        //Iterate inventory to find out valid meals for the food that expired first
        const mealcandidates: Array<Meal> = [];

        inventory.items.forEach((item: InventoryItem) => {
            //Find all meals that use this food
            let food = item.food;
            // this.log('food: ', food);
            let validmeals: Array<Meal> = [];
            meallist.items.forEach((meal: Meal) => {
                if (meal.contains(food)) {
                    // this.log(food.name);
                    //A valid meal should be considered valid if there is inventory for that food, and for the rest of ingredients
                    if (inventory.hasIngredientsFor(meal)) {
                        //Subtract from inventory
                        inventory.removeIngredientsOf(meal);
                        validmeals.push(meal);
                    }
                    else {
                        warnings.push(`⚠️ Warning!!: A meal was found for ${food.name} but there is not enough amount in inventory: ` + meal.name);
                    }
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
                warnings.push(`⚠️ Warning!!: No valid meal that includes ${food.name} or not enough amount in inventory`);

            }
        });

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
                            if ((meal.when === menu.name) && (meal.type === type) && (meal.age === person.age)) {
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
                            menu.items[menuindex] = `⚠️ Nothing for "${type}"`;
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

        this.setState({ data: <MealSchedule schedule={mealschedule} warnings={warnings} /> });


        //TODO: Iterate from today until end date, day by day
        //TODO: 
        //TODO: Iterate through all the inventory, sorted by date, ascending
        //TODO: For every item in the 
    }

    render() {
        if (this.state.data === null) {
            return (<div>loading....</div>)
        }
        else {
            return (<div><table><tbody>{this.state.data}</tbody></table></div>)
        }
    }
}

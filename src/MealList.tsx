import Meal from "./Meal";
import Ingredient from "./Ingredient";
import Food from "./Food";
import csv from 'csvtojson';

export default class MealList {
    /**
     * Name of the food, this name will be used to link Food with other entities like Meals
     */
    public items: Array<Meal> = [];

    public add(item: Meal): void {
        this.items.push(item);
    }

    public importFromArray(contents: Array<any>) {
        console.log('contents: ', contents);
        contents.forEach(item => {
            let ingredients: Array<Ingredient> = [];
            if (item.Ingredient_0 !== null) {
                ingredients.push(new Ingredient(new Food(item.Ingredient_0), parseFloat(item.Amount_0)));
            }
            if (item.Ingredient_1 !== null) {
                ingredients.push(new Ingredient(new Food(item.Ingredient_1), parseFloat(item.Amount_1)));
            }
            if (item.Ingredient_2 !== null) {
                ingredients.push(new Ingredient(new Food(item.Ingredient_2), parseFloat(item.Amount_2)));
            }
            if (item.Ingredient_3 !== null) {
                ingredients.push(new Ingredient(new Food(item.Ingredient_3), parseFloat(item.Amount_3)));
            }
            let person = '';
            if ((item.Person !== null) && (item.Person !== undefined)) {
                person = item.Person;
            }
            this.add(new Meal(item.Name, item.When, item.Type, item.Age, person, ingredients));
        });
    }


    // public async import(csvcontents: string): Promise<void> {
    //     let parser = csv();
    //     let json = await parser.fromString(csvcontents);
    //     json.forEach(item => {
    //         let ingredients: Array<Ingredient> = [];
    //         if (item.Ingredient_0 !== '') {
    //             ingredients.push(new Ingredient(new Food(item.Ingredient_0), item.Amount_0));
    //         }
    //         if (item.Ingredient_1 !== '') {
    //             ingredients.push(new Ingredient(new Food(item.Ingredient_1), item.Amount_1));
    //         }
    //         if (item.Ingredient_2 !== '') {
    //             ingredients.push(new Ingredient(new Food(item.Ingredient_2), item.Amount_2));
    //         }
    //         if (item.Ingredient_3 !== '') {
    //             ingredients.push(new Ingredient(new Food(item.Ingredient_3), item.Amount_3));
    //         }
    //         this.add(new Meal(item.Name, item.When, item.Type, item.Age, ingredients));
    //     });
    // }
}
import InventoryItem from "./InventoryItem";
import Meal from "./Meal";
import Ingredient from "./Ingredient";
import Food from "./Food";
import csv from 'csvtojson';

export default class Inventory {
    /**
     * Name of the food, this name will be used to link Food with other entities like Meals
     */
    public items: Array<InventoryItem> = [];

    public add(item: InventoryItem): void {
        this.items.push(item);
    }

    public async import(csvcontents: string): Promise<void> {
        let parser = csv();
        let json = await parser.fromString(csvcontents);
        json.forEach(item => {
            this.add(new InventoryItem(new Food(item.Item), item.Date, parseInt(item.Amount)));
        });
    }

    public importFromArray(contents: Array<any>) {
        contents.forEach(item => {
            this.add(new InventoryItem(new Food(item.Item), item.Date, parseInt(item.Amount)));
        });
    }

    public hasEnough(food: Food, amount: number): boolean {
        return (this.items.some((item: InventoryItem): boolean => {
            if ((item.food.name === food.name) && (item.amount < amount)) {
                console.log('item.food.name: ', item.food.name);
                console.log('amount requested: ', amount);
                console.log('amount in inventory: ', item.amount);
            }
            if ((item.food.name === food.name) && (item.amount >= amount)) {
                return (true);
            }
            else {
                return (false);
            }
        }));
    }

    public hasIngredientsFor(meal: Meal): boolean {
        let result = true;
        meal.ingredients.forEach((ingredient: Ingredient) => {
            if (!this.hasEnough(ingredient.food, ingredient.amount)) {
                result = false;
            }
        });
        return (result);
    }

    public remove(ingredient: Ingredient): void {
        this.items.forEach((item: InventoryItem) => {
            if (item.food.name === ingredient.food.name) {
                item.amount -= ingredient.amount;
            }
        });
    }


    public removeIngredientsOf(meal: Meal): void {
        meal.ingredients.forEach((ingredient: Ingredient) => {
            this.remove(ingredient)
        });
    }

}
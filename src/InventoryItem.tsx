import Food from "./Food";

export default class InventoryItem {
    /**
     * Name of the food, this name will be used to link Food with other entities like Meals
     */
    public food: Food;
    /**
     * Date when the food expires, yyyy/mm/dd
     */
    public bestbefore: string = '';
    /**
     * Amount in inventory that expires on the best before date
     * The unity should be the number of consumible units, for example, can be grams
     */
    public amount: number = 0;

    constructor(food: Food, bestbefore: string, amount: number) {
        this.food = food;
        this.bestbefore = bestbefore;
        this.amount = amount;
    }
}
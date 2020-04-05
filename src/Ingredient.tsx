import Food from "./Food";

export default class Ingredient {
    /**
     * Name of the food, this name will be used to link Food with other entities like Meals
     */
    public food: Food;

    public amount: number;

    constructor(food: Food, amount: number) {
        this.food = food;
        this.amount = amount;
    }
}
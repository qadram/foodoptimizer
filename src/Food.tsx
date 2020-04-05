export default class Food {
    /**
     * Name of the food, this name will be used to link Food with other entities like Meals
     */
    public name: string = '';

    constructor(name: string) {
        this.name = name;
    }
}
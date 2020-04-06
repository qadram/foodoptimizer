import Ingredient from "./Ingredient";
import Food from "./Food";
import React, { Component } from "react";

export default class Meal extends Component {
    public name: string = '';
    public ingredients: Array<Ingredient> = [];
    public when: string = '';
    public type: string = '';
    public age: string = '';
    public person: string = '';

    public contains(food: Food): boolean {
        return (this.ingredients.some((ingredient: Ingredient) => {
            if (ingredient.food.name === food.name) {
                return (true);
            }
            else {
                return (false);
            }
        }));
    }

    render() {
        return (<td>{this.name}</td>);
    }

    constructor(name: string, when: string, type: string, age: string, person: string, ingredients: Array<Ingredient>) {
        super({});
        this.name = name;
        this.when = when;
        this.type = type;
        this.age = age;
        this.person = person;
        this.ingredients = ingredients;
    }
}
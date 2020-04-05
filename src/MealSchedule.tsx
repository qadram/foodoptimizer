import React, { Component } from "react";
import MealPlan from "./MealPlan";
import Menu from "./Menu";

export type MealScheduleProps = {
    schedule?: Map<string, MealPlan>
}

export type MealScheduleState = {
}


export default class MealSchedule extends Component<MealScheduleProps, MealScheduleState> {
    public schedule: Map<string, MealPlan> = new Map();

    constructor(props: MealScheduleProps) {
        super(props);
        if (props.schedule) {
            this.schedule = props.schedule;
        }
    }

    render() {
        let items: Array<any> = [];
        this.schedule.forEach((mealplan: MealPlan, date: string) => {
            console.log('date: ', date);
            let cDate = <th>{date}</th>;
            let cMenus: Array<any> = [];
            mealplan.items.forEach((menu: Menu) => {
                let cFood: Array<any> = [];
                menu.items.forEach((food: string) => {
                    cFood.push(<tr><td>{food}</td></tr>);
                });
                cMenus.push(<td><table><tbody><tr><th>{menu.name}</th></tr>{cFood}</tbody></table></td>);
            });
            items.push(<tr>{cDate}{cMenus}</tr>);
        });
        console.log('items: ', items);
        return (items);
    }
}
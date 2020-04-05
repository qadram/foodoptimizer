import React, { Component } from "react";
import MealPlan from "./MealPlan";
import Menu from "./Menu";

export type MealScheduleProps = {
    schedule?: Map<string, Array<MealPlan>>
}

export type MealScheduleState = {
}


export default class MealSchedule extends Component<MealScheduleProps, MealScheduleState> {
    public schedule: Map<string, Array<MealPlan>> = new Map();

    constructor(props: MealScheduleProps) {
        super(props);
        if (props.schedule) {
            this.schedule = props.schedule;
        }
    }

    render() {
        let items: Array<any> = [];
        this.schedule.forEach((mealplans: Array<MealPlan>, date: string) => {
            let cDate = <th>{date}</th>;
            let peoplemenus: Array<any> = [];                        
            mealplans.forEach((mealplan: MealPlan) => {
                let cMenus: Array<any> = [];
                mealplan.items.forEach((menu: Menu) => {
                    let cFood: Array<any> = [];
                    menu.items.forEach((food: string) => {
                        cFood.push(<tr><td>{food}</td></tr>);
                    });
                    cMenus.push(<td><table><tbody><tr><th>{menu.name}</th></tr>{cFood}</tbody></table></td>);
                });
            peoplemenus.push(<tr><td>{mealplan.person}</td>{cMenus}</tr>);
            });
            items.push(<tr>{cDate}<table><tbody>{peoplemenus}</tbody></table></tr>);            
        });
        return (items);
    }
}
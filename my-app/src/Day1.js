import React from "react";
import data from './input/1-1.txt';

class Day1 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        fetch(data)
            .then(
                (response) => {
                    return response.text();
                }
            )
            .then(
                (text) => {
                    let items = text.replace(/\n$/, "").split('\n');

                    items = this.formatDrift(items)
                    items = this.calcDrift(items, 0)

                    let answer = this.day1Calc(items);

                    let drifts = this.calcRepeatDrifts(items, 0, 2);

                    this.setState({
                        isLoaded: true,
                        items: items,
                        answer: answer,
                        drifts: drifts
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                })
    }

    render() {
        const { error, isLoaded, items, answer, drifts } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    Day 1<br/>
                    <div>Answer:: { answer } </div>

                    <div>Drifts</div>
                    <ul>
                        {drifts.map(drift => (
                            <li>{drift}</li>
                        ))}
                    </ul>
                </div>

            );
        }
    }

    calcDrift = (items, frequency) => {
        for (let item of items) {
            frequency += item.drift;
            item.frequency = frequency
        }
        return items
    }

    formatDrift = (items) => {
        let newArray = [];
        for (let item of items) {
            newArray.push({
                drift: parseFloat(item)
            })
        }
        return newArray
    }

    day1Calc = (items) => {
        return items[items.length - 1].frequency
    }

    calcRepeatDrifts = (items, frequency, count) => {
        let repeats = [];
        let driftCount = 0;
        let frequencies = [];

        while (driftCount < count) {
            for (let item of items) {
                frequency += item.drift;
                frequencies[frequency] = frequencies[frequency] ? frequencies[frequency] + 1 : 1;
                if (frequencies[frequency] == 2) {
                    driftCount ++;
                    repeats.push(frequency);
                    if (driftCount == 2) {
                        break;
                    }
                }
            }
        }
        return repeats;
    }
}

export default Day1;

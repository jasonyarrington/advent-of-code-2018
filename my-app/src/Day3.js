import React from "react";
import data from "./input/3-1.txt";
import testData from "./input/3-1-test.txt";
import Day1 from "./Day1";

class Day3 extends React.Component {

    test = true;

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            answers: []
        }
    }

    componentDidMount() {
        // if (this.test) {
        //     debugger;
        //
        //     data = testData;
        // }

        fetch(data)
            .then(
                (response) => {
                    return response.text();
                }
            )
            .then(
                (text) => {
                    this.process(text);
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            )
    }

    render() {
        const { error, isLoaded, answers } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    Day 3<br/>

                    {answers.map(answer => (
                        <span key={answer.label}>{answer.label}:: {answer.value}<br/></span>
                    ))}
                </div>
            )
        }
    }

    parseRecords = (text) => {

        // Split on rows
        let items = {};

        let records = text.replace(/\n$/, "").split('\n');

        for (let [key, value] of records.entries()) {
            let temp = value.split(" ");

            let id = parseFloat(temp[0].substr(1));
            let position = temp[2].split(",");
            let size = temp[3].split("x");
            let coords = {};

            position = {
                x: parseFloat(position[0]),
                y: parseFloat(position[1])
            }

            size = {
                w: parseFloat(size[0]),
                h: parseFloat(size[1])
            }

            for (let x = position.x; x < position.x + size.w; x++) {
                for (let y = position.y; y < position.y + size.h; y++ ) {
                    coords[x] = coords[x] || {};
                    coords[x][y] = true;
                }
            }

            let record = {
                id : id,
                position: position,
                size: size,
                coords: coords
            }
            items[id] = record;
        }

        console.log("items::", items);
        return items;
    }

    process = (text) => {

        let boxes = this.parseRecords(text);

        let masterBox = {};

        let count = 0;

        let nonOverlappedBoxes = {};

        // Looping through cloth
        // for (let x = 0; x < 1000; x++ ) {
        //     masterBox[x] = {};
        //     for (let y = 0; y < 1000; y++) {
        //         masterBox[x][y] = 0;
        //         for (let box of boxes) {
        //             box.overlap = false;
        //             if (box.coords[x] && box.coords[x][y]) {
        //                 masterBox[x][y]++;
        //                 if (masterBox[x][y] === 2) {
        //                     count++;
        //                     box.overlap = true;
        //                     break;
        //                 }
        //             }
        //             if (!box.overlap) {
        //                 nonOverlappedBoxes[box.id] = true;
        //             }
        //         }
        //     }
        // }

        // Looping through boxes

        for (let key of Object.keys(boxes)) {
            let box = boxes[key];
            box.overlap = box.overlap || false;

            for (let x = box.position.x; x < box.position.x + box.size.w; x++) {
                masterBox[x] = masterBox[x] || {};

                for (let y = box.position.y; y < box.position.y + box.size.h; y++) {
                    masterBox[x][y] = masterBox[x][y] || {ids: [], count: 0};
                    masterBox[x][y].ids.push(box.id);
                    masterBox[x][y].count++;
                    if (masterBox[x][y].count > 1) {
                        // debugger;
                        count++;
                        for (let id of masterBox[x][y].ids) {
                            boxes[id].overlap = true;
                        }
                        //break;
                    }
                }
            }
        }

        for (let key of Object.keys(boxes)) {
            let box = boxes[key];
            if (!box.overlap) {
                nonOverlappedBoxes[box.id] = true;
            }
        }
        console.log(boxes);

            console.log(masterBox);

        // this.drawBoxes(boxes);
        //
        // this.checkGrid();

        let answers = [];

        answers.push({
            label: 'Square inches with overlap',
            value: count
        })

        answers.push({
            label: 'Non-overlapped boxes',
            value: JSON.stringify(nonOverlappedBoxes)
        })

        this.setState({
            isLoaded: true,
            answers: answers
        });
    }
}

export default Day3;

import React from "react";
import data from "./input/3-1.txt";
import testData from "./input/3-1-test.txt";
import ComponentBase from "./ComponentBase";


class Day4 extends ComponentBase {

    test = true;

    d = this.test ? testData : data;

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            day: '4',
            answers: []
        }
    }

    componentDidMount() {
        super.componentDidMount();
    }

    // Called from componentDidMount
    parseRecords = (text) => {

        // Split on rows
        let items = {};

        let records = this.parseFile(text);

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

export default Day4;

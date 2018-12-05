import React from "react";

class ComponentBase extends React.Component {

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

        fetch(this.d)
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
        const { error, isLoaded, day, answers } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    Day {day}<br/>

                    {answers.map(answer => (
                        <span key={answer.label}>{answer.label}:: {answer.value}<br/></span>
                    ))}
                </div>
            )
        }
    }

    parseFile = (text) => {
        // Split on rows
        let records = text.replace(/\n$/, "").split('\n');

        return records;
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

export default ComponentBase;

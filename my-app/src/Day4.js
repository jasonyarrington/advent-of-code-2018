import React from "react";
import data from "./input/4-1.txt";
import testData from "./input/4-1-test.txt";
import ComponentBase from "./ComponentBase";


class Day4 extends ComponentBase {

    test = false;

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

        this.state.display = this.state.display || '';

        // Split on rows
        let records = this.parseFile(text);

        // Sort array
        records.sort();

        for (let [key, value] of records.entries()) {
            this.state.display += value + "\n";
        }

        return records;
    }

    recordProcessor = (record) => {

        // timestamp
        let timeStampRegex = /\[(.*?)\]/;
        let temp = timeStampRegex.exec(record);
        let timestamp = temp[1];

        let hour = timestamp.substr(11, 2);
        let minute = timestamp.substr(14,2);
        let day = timestamp.substr(0, 10);

        this.state.display += timestamp + " " + day + " " + hour + " " + minute + " ";

        // Record value
        let value = record.replace(timeStampRegex, "").trim();

        this.state.display += value;

        let recordType = null;

        let guardId = null;

        // Record type
        if (recordType = /Guard/.exec(value)) {
            this.state.display += " -- guard";
            recordType = 'guard';
            guardId = value.match(/#[0-9]*/);
            guardId = guardId[0].substr(1);
        } else if (recordType = /wakes up/.exec(value)) {
            this.state.display += " -- wake";
            recordType = 'wake';
        } else if (recordType = /falls asleep/.exec(value)) {
            this.state.display += " -- sleep";
            recordType = 'sleep';
        }

        this.state.display += "\n";

        return {
            timestamp: timestamp,
            recordType: recordType,
            guardId: guardId,
            day: day,
            hour: hour,
            minute: parseInt(minute)
        }
    }

    maxMinute = (record) => {

        let max = 0;
        let index = null;
        for (let i = 0; i < record.min.length; i++) {
            if (record.min[i] > max) {
                max = record.min[i];
                index = i;
            }
        }

        return index;
    }


    process = (text) => {

        let logs = this.parseRecords(text);

        let start;
        let sleep;
        let wake;
        let guardRecords = {};
        let maxSleeper = {
            guardId : null,
            minutesAsleep: 0
        };

        // Looping through boxes
        for (let log of logs) {
            let record = this.recordProcessor(log);

            if (record.recordType === 'guard') {
                start = record;
                if (guardRecords[start.guardId] === undefined) {
                    guardRecords[start.guardId] = { shifts : 0, minutesAsleep : 0, min : []};
                    for (let min = 0; min < 60; min++) {
                        guardRecords[start.guardId].min[min] = 0;
                    }
                }
                guardRecords[start.guardId].shifts++;
            } else if (record.recordType === 'sleep') {
                sleep = record;
            } else if (record.recordType === 'wake') {
                wake = record;
                for (let min = sleep.minute; min < wake.minute; min++ ) {
                    guardRecords[start.guardId].min[min]++;
                    guardRecords[start.guardId].minutesAsleep++;
                }
                if (maxSleeper.minutesAsleep < guardRecords[start.guardId].minutesAsleep) {
                    maxSleeper.minutesAsleep = guardRecords[start.guardId].minutesAsleep;
                    maxSleeper.guardId = start.guardId;
                }
            }
        }

        for (let r of Object.keys(guardRecords)) {

            this.state.display += r + ' ' + guardRecords[r].shifts + ' ';
            for (let min of guardRecords[r].min) {
                this.state.display += min;
            }
            this.state.display += "\n";
        }

        let maxMinute = this.maxMinute(guardRecords[maxSleeper.guardId]);



        // this.drawBoxes(boxes);
        //
        // this.checkGrid();

        let answers = [];

        answers.push({
            label: 'Guard asleep the most',
            value: maxSleeper.guardId
        })

        answers.push({
            label: 'Guard asleep most at minute',
            value:  maxMinute
        })

        answers.push({
            label: 'GuardID times minutes',
            value: maxSleeper.guardId * maxMinute
        })
        //
        // answers.push({
        //     label: 'Non-overlapped boxes',
        //     value: JSON.stringify(nonOverlappedBoxes)
        // })

        this.setState({
            isLoaded: true,
            answers: answers
        });
    }
}

export default Day4;

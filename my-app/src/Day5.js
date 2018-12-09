import React from "react";
import data from "./input/5-1.txt";
import testData from "./input/5-1-test.txt";
import ComponentBase from "./ComponentBase";


class Day5 extends ComponentBase {

    test = false;

    d = this.test ? testData : data;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        super.componentDidMount();
        this.state.day = 5;
    }

    // Called from componentDidMount
    parseRecords = (text) => {

        // Split on rows
        let records = this.parseFile(text);

        for (let [key, value] of records.entries()) {
            this.state.display += value + "\n";
        }

        return records;
    }


    removeChar = (str, position) => {
        return str.slice(0,position) + str.slice(position + 1,str.length);
    }

    removeMatch = (str, position) => {
        return str.slice(0,position) + str.slice(position + 2,str.length);
    }

    checkMatch = (a, b) => {
        return a.toLowerCase() === b.toLowerCase() && this.getCase(a) !== this.getCase(b);
    }

    getCase = (str) => {
        return str.toUpperCase() === str ? 'uppercase' : 'lowercase'
    }

    processPolymer = (text) => {
        text = text.trim();
        let range = [0, text.length - 1];
        while (range[0] < range[1]) {
            // console.log(range[0], range[1]);
            if (this.checkMatch(text[range[0]], text[range[0]+1])) {
                text = this.removeMatch(text, range[0]);
                // if (this.test) {
                //     this.pushDisplay(text);
                // }
                range[1] = range[1] - 2;
                if (range[0] > 0) {
                    range[0]--;
                }
            } else {
                range[0]++;
            }
        }

        this.pushDisplay(text.length);

        return text.length;
    }

    processReducedPolymers = (text) => {
        let alpha = "abcdefghijklmnopqrstuvwxyz";
        text = text.trim();
        let temp = [];
        let polymers = {};
        let letter;
        let minLength = text.length;
        let minLetter = null;

        for (let delta = 0; delta < alpha.length; delta++) {
            temp = text;
            letter = alpha[delta];
            this.pushDisplay(letter + " ", true);
            // Remove letter
            let range = [0, temp.length];
            while (range[0] < range[1]) {
                if (temp[range[0]].toLowerCase() === letter) {
                    temp = this.removeChar(temp, range[0]);
                    range[1] = temp.length;
                } else {
                    range[0]++;
                }
            }

            // Get length of polymer after letter removed
            // this.pushDisplay(temp);
            polymers[letter] = this.processPolymer(temp);
            if (polymers[letter] < minLength) {
                minLength = polymers[letter];
                minLetter = letter;
            }
        }

        this.pushDisplay('min:: ' + minLetter + " " + minLength);
        return minLength;
    }

    process = (text) => {

        let answers = [];

        let polymerLength = this.processPolymer(text);

        answers.push({
            label: 'Length of Polymer chain at the end',
            value: polymerLength
        })

        let blah = this.processReducedPolymers(text);

        answers.push({
            label: 'Length of shortest polymer',
            value: 'blah'
        })

        this.setState({
            isLoaded: true,
            answers: answers
        });
    }
}

export default Day5;

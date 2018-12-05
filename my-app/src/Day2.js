import React from "react";
import data2 from './input/2-1.txt';

class Day2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        fetch(data2)
            .then(
                (response) => {
                    return response.text();
                }
            )
            .then(
                (text) => {
                    let items = text.replace(/\n$/, "").split('\n');
                    let idsWithCounts = this.day2Calc(items);
                    let answer = idsWithCounts[2] * idsWithCounts[3];
                    let sig = this.scanItems(items);

                    this.setState({
                        isLoaded: true,
                        answer: answer,
                        sig: sig
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
        const { error, isLoaded, answer, sig } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    Day 2<br/>

                    Answer:: checksum { answer } <br/>

                    Signature:: { sig }


                </div>
            )
        }
    }

    parseBox = (str) => {

        // Number of times each char is in string
        // { p : 1, t :1 }
        // console.log('str:: ', str);
        let chars = {};
        for (let char of str.split("")) {
            chars[char] = chars[char] ? chars[char] + 1 : 1;
        }

        // console.log('chars:: ', chars);

        // List of counts (1 = true, 4 = true
        let result = {};
        for (let value of Object.values(chars)) {
            result[value] = true;
        }
        // console.log('result::', result);
        return result;
    }

    day2Calc = (items) => {

        let idsWithCounts = {};

        for (let item of items) {
            let oldItem = item;
            item = {};
            item.value = oldItem;
            item.result = this.parseBox(item.value);

            let keys = Object.keys(item.result);
            for (let ct in keys) {
                let val = parseInt(keys[ct]);
                idsWithCounts[val] = idsWithCounts[val] !== undefined ? idsWithCounts[val] + 1 : 1;
            }

        }

        // console.log('idsWithCounts', idsWithCounts);
        return idsWithCounts;
    };

    scanItems = (items) => {
        // console.log('items::', items);
        let match = false;
        for (let i = 0; i < items.length; i++) {
            let a = items[i];
            for (let j = i+1; j < items.length; j++) {
                let b = items[j];
                match = this.compareString(a, b);
                if (match) {
                    return match;
                }
            }
        }
        return match;
    }

    compareString = (a, b) => {
        // console.log('compare:: ', a, b);
        a = a.split("");
        b = b.split("");
        let match = true;
        let miss = 0;
        let str = "";
        for (let i = 0; i < a.length; i++) {
            if (a[i] === b[i]) {
                str += a[i];
            } else {
                miss++;
                if (miss > 1) {
                    break;
                }
            }
        }

        // console.log(miss);
        return miss < 2 ? str : false;
    }
}

export default Day2;

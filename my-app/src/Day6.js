import React from "react";
import data from "./input/6-1.txt";
import testData from "./input/6-1-test.txt";
import ComponentBase from "./ComponentBase";


class Day6 extends ComponentBase {

    test = false;

    safeDistance = 10000;

    d = this.test ? testData : data;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        super.componentDidMount();
        this.state.day = 6;
    }

    bound = (z, coords) => {

        // d.......d
        // .....z...
        // .........
        // .........
        // d.......d

        let boundLeft = false;
        let boundRight = false;
        let boundTop = false;
        let boundBottom = false;

        for (let d of coords) {
            // left - right
            if (Math.abs(z.x - d.x) > Math.abs(z.y - d.y)) {
                if (z.x > d.x) {
                    boundLeft = true;
                } else {
                    boundRight = true;
                }
            }

            // top - bottom
            if (Math.abs(z.y - d.y) > Math.abs(z.x - d.x)) {
                if (z.y > d.y) {
                    boundTop = true;
                } else {
                    boundBottom = true;
                }
            }
            // Stop if we have figured out that it is bound.
            if (boundLeft && boundRight && boundTop && boundBottom) {
                return true;
            }
        }

        return false;

    }

    isInfinite = (coord, bounds, coords) => {
        if ( coord.x === bounds.x.min || coord.x === bounds.x.max || coord.y === bounds.y.min || coord.y === bounds.y.max) {
            return true;
        }

        return !this.bound(coord, coords);
    }

    // Called from componentDidMount
    parseRecords = (text) => {
        // Split on rows
        let records = this.parseFile(text);
        
        for (let [key, value] of records.entries()) {
            let temp = value.split(",");
            records[key] = {
                x: parseInt(temp[0].trim()),
                y: parseInt(temp[1].trim())
            }
        }
        return records;
    }

    getBounds = (arr) => {

        let bounds = {
            x: {
                min: arr[0].x,
                max: arr[0].x
            },
            y: {
                min: arr[0].y,
                max: arr[0].y
            }
        };

        for (let coord of arr) {
            if (coord.x < bounds.x.min) {
                bounds.x.min = coord.x;
            }

            if (coord.x > bounds.x.max) {
                bounds.x.max = coord.x;
            }

            if (coord.y < bounds.y.min) {
                bounds.y.min = coord.y;
            }

            if (coord.y > bounds.y.max) {
                bounds.y.max = coord.y;
            }
        }

        // bounds.x.min--;
        // bounds.x.max++;
        // bounds.y.min--;
        // bounds.y.max++;

        console.log('bounds:: ',bounds);
        return bounds;
    }

    compareX = (a,b) => {
        if (a.x <b.x)
            return -1;
        if (a.x > b.x)
            return 1;
        return 0;
    }

    compareY = (a,b) => {
        if (a.y < b.y)
            return -1;
        if (a.y > b.y)
            return 1;
        return 0
    }

    distance = (a, b) => {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    };

    isOnBoundary = (x, y, bounds) => {
        return (x === bounds.x.min || x === bounds.x.max || y === bounds.y.min || y === bounds.y.max);
    };

    process = (text) => {

        let coords = this.parseRecords(text);

        let bounds = this.getBounds(coords);

        for (let [index, r] of coords.entries()) {
            coords[index].index = index;
            coords[index].infinite = false;
            coords[index].count = 0;
        }

        this.pushDisplay(JSON.stringify(bounds));

        // Loop through bounds, if closest is on edge, then it is infinite.
        // otherwise mark add grid point to point that is closest

        let grid = {};

        let safeBlocks = 0;
        for (let y = bounds.y.min; y <= bounds.y.max; y++) {
            grid[y] = {};
            for (let x = bounds.x.min; x <= bounds.x.max; x++) {
                grid[y][x] = '_';
                let closestDistance = 0;
                let closestCoords = [];
                let totalDistance = 0;

                for (let [index, coord] of coords.entries()) {
                    // find closest one or ones
                    let dist = this.distance(coord, {x: x, y: y});
                    totalDistance += dist;
                    if (index === 0 || dist < closestDistance) {
                        closestDistance = dist;
                        closestCoords = [coord.index];
                    } else if (dist === closestDistance) {
                        closestCoords.push(coord.index);
                    }
                }

                console.log('cc ', closestCoords);
                if (closestCoords.length > 1) {
                    grid[y][x] = '.';
                } else if (closestCoords.length === 1) {
                    grid[y][x] = closestCoords[0];

                    for (let c of closestCoords) {
                        // Increment count
                        coords[c].count++;
                        // If on edge, set to infinite
                        if (this.isOnBoundary(x, y, bounds)) {
                            coords[c].infinite = true;
                        }
                    }


                }
                this.pushDisplay(grid[y][x], true);
                // If we are on the edge, then each of the closestCoords is infinite

                if (totalDistance < this.safeDistance) {
                    safeBlocks++;
                }
            }
            this.pushDisplay("");
        }

        let coordWithMostSquares = null;
        let mostSquares = 0;
        for (let c of coords) {
            if (!c.infinite && c.count > mostSquares) {
                mostSquares = c.count;
                coordWithMostSquares = c.index;
            }
        }

        console.log(coords);

        let answers = [];

        answers.push({
            label: 'Safest spot',
            value: coordWithMostSquares + ":: " + mostSquares
        })

        answers.push({
            label: 'Safe blocks',
            value: safeBlocks
        })

        this.setState({
            isLoaded: true,
            answers: answers
        });
    }
}

export default Day6;

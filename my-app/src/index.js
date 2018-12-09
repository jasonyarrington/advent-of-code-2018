// import React from 'react';
import React, { Suspense, lazy, asyncComponent } from 'react';

import ReactDOM from 'react-dom';
import './index.css';
import Day1 from './Day1';
import Day2 from './Day2';
import Day3 from './Day3';
import Day4 from './Day4';
import Day5 from './Day5';
import Day6 from './Day6';

class Calendar extends React.Component {
    render() {
        return (
            <div className="calendar">
                Advent of code calendar
                <Suspense fallback={<div>Loading...</div>}>

                <div className="calendar-days">
                        <Day6 />
                </div>
                </Suspense>

            </div>
    );
    }
}

// ========================================

ReactDOM.render(
<Calendar />,
    document.getElementById('root')
);
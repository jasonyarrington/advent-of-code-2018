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
        const { error, isLoaded, day, answers, display } = this.state;

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

                    <pre>{display}</pre>
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
        // Override and place results in answers
    }
}

export default ComponentBase;

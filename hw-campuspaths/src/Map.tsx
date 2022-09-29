/*
 * Copyright (C) 2022 Kevin Zatloukal.  All rights reserved.  Permission is
 * hereby granted to students registered for University of Washington
 * CSE 331 for use solely during Spring Quarter 2022 for purposes of
 * the course.  No other use, copying, distribution, or modification
 * is permitted without prior written consent. Copyrights for
 * third-party components of this work must be honored.  Instructors
 * interested in reusing these course materials should contact the
 * author.
 */
import {LatLngExpression} from "leaflet";
import React, {Component} from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapLine from "./MapLine";
import {UW_LATITUDE_CENTER, UW_LONGITUDE_CENTER} from "./Constants";
import {Edge} from "./Edge";
import "./App.css";

// This defines the location of the map. These are the coordinates of the UW Seattle campus
const position: LatLngExpression = [UW_LATITUDE_CENTER, UW_LONGITUDE_CENTER];

// NOTE: This component is a suggestion for you to use, if you would like to. If
// you don't want to use this component, you're free to delete it or replace it
// with your hw-lines Map

interface MapProps {
    drawEdges: Edge[]
}


interface MapState {
    buildings: string[] //short name list of buildings
    list: string
}

class Map extends Component<MapProps, MapState> {

    constructor(props: MapProps) {
        super(props);
        this.state = {
            buildings: [],     // list of all the buildings (populate it when loaded)
            list: "BAG", // BAG is the building name always starting in drop down list first
        };
    }

    componentDidMount() {
        this.fetchDropList();
    }

    // Creates drop-down list of buildings on campus from the server data of campus buildings
    fetchDropList() {
        // Get the JSON info from server on buildings, sorted alphabetically
        fetch("http://localhost:4567/buildings")
            .then((res) => {
                return res.json();
            })
            // Save the building information
            .then(data => {
                this.setState({
                    buildings: Object.keys(data).sort() // Short names of buildings, sorted
                })
            });
    }

    // Updates the starting building value from the dropdown list
    handleListChange = (event: any) => {
        this.setState({
            list: event.target.value
        });
    }

    // Resets the program to make page as if freshly loaded
    handleClearClick = (event: any) => {
        this.setState({
            list: "BAG", // BAG is the building name always starting in drop down list first
        })
    }

    render() {
        return (
            <div id="map">
                <div id="dropdown">
                    <p>List of Buildings:</p>
                    <select value={this.state.list} onChange={this.handleListChange}>
                        {this.state.buildings.map((building) =>
                            <option key={building} value={building}>{building}</option>)}
                    </select>
                </div>
                <MapContainer
                    center={position}
                    zoom={15}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        this.props.drawEdges.map((edge) =>
                            <MapLine
                                color={"purple"}
                                x1={edge.x1}
                                x2={edge.x2}
                                y1={edge.y1}
                                y2={edge.y2}
                                key={""}/>)
                    }
                </MapContainer>
                <div id="instructions">
                    Input the short name of the start and end buildings with a space between them! Ex: CSE KNE
                </div>
            </div>
        );
    }
}

export default Map;
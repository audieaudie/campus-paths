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

package campuspaths;

import campuspaths.utils.CORSFilter;
import com.google.gson.Gson;
import pathfinder.CampusMap;
import pathfinder.datastructures.Path;
import pathfinder.datastructures.Point;
import spark.Spark;

import java.util.Map;

public class SparkServer {

    public static void main(String[] args) {
        CORSFilter corsFilter = new CORSFilter();
        corsFilter.apply();
        // The above two lines help set up some settings that allow the
        // React application to make requests to the Spark server, even though it
        // comes from a different server.
        // You should leave these two lines at the very beginning of main().

        Gson gson = new Gson();
        CampusMap cm = new CampusMap();

        //returns the shortest path between the source and destination
        Spark.get("/path", (request, response) -> {
            String src = request.queryParams("start");
            String dst = request.queryParams("end");
            if (src == null) {
                Spark.halt(400, "A start point must be provided");
            }
            if (dst == null) {
                Spark.halt(400, "A endpoint must be provided");
            }
            Path<Point> path = cm.findShortestPath(src, dst);
            return gson.toJson(path);
        });

        //returns the names of the buildings
        Spark.get("/buildings", (request, response) -> {
            Map<String, String> buildings = cm.buildingNames();
            return gson.toJson(buildings);
        });
    }

}

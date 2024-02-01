import React from "react";
import MovieList from "./MovieList";
import {Route, Routes} from "react-router-dom";
import FilmMainPage from "../film-page/FilmMainPage";

export function Container(): React.ReactElement {
  return (
    <div className="container">
      <div className="movies">
        <Routes>
          <Route path="/" element={
            <MovieList />
          }/>
          <Route path="/films/:uuid" element={
            <FilmMainPage />
          }/>
          <Route path="*" element={
            <h1>Not found</h1>
          }/>
        </Routes>
      </div>
    </div>
  );
}

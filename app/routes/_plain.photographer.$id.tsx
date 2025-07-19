import React from "react";
import { useParams } from "react-router";

export default function PhotographerDetail() {
  const { id } = useParams();

  return <div>Photographer id is {id}</div>;
}

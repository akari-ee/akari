import React from "react";
import { useParams } from "react-router";

export default function CollectionDetail() {
  const { id } = useParams();
  
  return <div>Collection id is {id}</div>;
}

import React from "react";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";

export default function Item({
  item,
  campos,
  detalhes,
  editar,
  deleteFn,
}) {
  return (
    <tr>
      {campos.map((campo, index) => (
        <td key={index} className="px-4 text-center">
          {typeof campo === "function" ? campo(item) : item[campo] || "—"}
        </td>
      ))}
      <td className="px-4">
        <a
          title="Ver"
          className="btn btn-info btn-sm me-2"
          href={`/#/${detalhes}/${item.id}`}
        >
          <HiEye />
        </a>
        <a
          title="Editar"
          className="btn btn-warning btn-sm me-2"
          href={`/#/${editar}/${item.id}`}
        >
          <HiPencil />
        </a>
        <button
          title="Apagar"
          className="btn btn-danger btn-sm"
          onClick={() => deleteFn(item.id)}
        >
          <HiTrash />
        </button>
      </td>
    </tr>
  );
}
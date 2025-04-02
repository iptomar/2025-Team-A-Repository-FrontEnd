import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../css/horario.css";

const initialLessons = {
    disponiveis: ["Matemática", "Português", "História", "Física", "Química", "Inglês"],
    segunda: [],
    terça: [],
    quarta: [],
    quinta: [],
    sexta: [],
    sábado: [],
};

const SchedulePage = () => {
    const [lessons, setLessons] = useState(initialLessons);

    const handleDragEnd = (result) => {
        if (!result.destination) return; // Se não for largado em nenhum local, ignora

        const { source, destination } = result;
        const sourceDay = source.droppableId;
        const destDay = destination.droppableId;

        const newLessons = { ...lessons };

        // Se for arrastado de volta para o painel de disciplinas disponíveis
        if (destDay === "disponiveis") {
            // Apenas remove a disciplina do dia de origem (não duplica)
            if (sourceDay !== "disponiveis") {
                const [movedLesson] = newLessons[sourceDay].splice(source.index, 1);

                // Evita adicionar duplicatas na lista de disponíveis
                if (!newLessons[destDay].includes(movedLesson)) {
                    newLessons[destDay].push(movedLesson);
                }
            }
        } else {
            // Se for arrastado da área de disciplinas disponíveis para um dia da semana, faz uma cópia
            if (sourceDay === "disponiveis") {
                const movedLesson = newLessons[sourceDay][source.index];

                // Evita duplicatas no mesmo dia
                if (!newLessons[destDay].includes(movedLesson)) {
                    newLessons[destDay].splice(destination.index, 0, movedLesson);
                }
            } else {
                // Se for movido entre os dias da semana, apenas move normalmente
                const [movedLesson] = newLessons[sourceDay].splice(source.index, 1);
                newLessons[destDay].splice(destination.index, 0, movedLesson);
            }
        }

        setLessons(newLessons);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="container">
                {/* Área Lateral */}
                <Droppable droppableId="disponiveis" direction="horizontal">
                    {(provided) => (
                        <div className="top-panel" ref={provided.innerRef} {...provided.droppableProps}>
                            <h3>Disciplinas Disponíveis</h3>
                            <div className="disciplinas-wrapper">
                                {lessons.disponiveis.map((lesson, index) => (
                                    <Draggable key={lesson} draggableId={lesson} index={index}>
                                        {(provided) => (
                                            <div
                                                className="lesson"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {lesson}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            </div>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                {/* Área do Horário */}
                <div className="horario">
                    {Object.keys(lessons)
                        .filter((day) => day !== "disponiveis")
                        .map((day) => (
                            <Droppable droppableId={day} key={day}>
                                {(provided) => (
                                    <div className="day-column" ref={provided.innerRef} {...provided.droppableProps}>
                                        <h3>{day}</h3>
                                        <div className="grid-disciplinas">
                                            {lessons[day].map((lesson, index) => (
                                                <Draggable key={`${lesson}-${day}-${index}`} draggableId={`${lesson}-${day}-${index}`} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            className="lesson"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            {lesson}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        </div>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                </div>
            </div>
        </DragDropContext>
    );
};

export default SchedulePage;

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const DragDropQuestion = ({ question, answer, onAnswerChange }) => {
    const [dragItems, setDragItems] = useState([]);
    const [dropZones, setDropZones] = useState([]);

    // Fixed useEffect for initializing drag items and drop zones
    useEffect(() => {
        if (question?.drag_items && question.drag_items.length > 0) {
            // Create drag items from question data
            const items = question.drag_items.map((item, index) => ({
                id: `item-${index}`,
                content: item.text,
                originalIndex: index
            }));
            setDragItems(items);

            // Initialize drop zones with correct length based on drag_items
            const numZones = question.drag_items.length;
            const zones = Array(numZones).fill(null).map((_, index) => {
                // Check if there's an existing answer for this position
                const answeredIndex = answer && Array.isArray(answer) && answer[index] !== "" ? parseInt(answer[index]) : null;
                return {
                    id: `zone-${index}`,
                    label: `Position ${index + 1}`,
                    itemId: answeredIndex !== null ? `item-${answeredIndex}` : null
                };
            });
            setDropZones(zones);
        }
    }, [question]);

    // Fixed useEffect for updating zones when answer changes
    useEffect(() => {
        if (question?.drag_items && Array.isArray(answer)) {
            const numZones = question.drag_items.length;
            const updatedZones = Array(numZones).fill(null).map((_, index) => {
                const answeredIndex = answer[index] !== "" ? parseInt(answer[index]) : null;
                return {
                    id: `zone-${index}`,
                    label: `Position ${index + 1}`,
                    itemId: answeredIndex !== null ? `item-${answeredIndex}` : null
                };
            });
            setDropZones(updatedZones);
        }
    }, [answer, question]);

    // Handle drag end event
    const handleDragEnd = (result) => {
        const { source, destination } = result;

        // Dropped outside a drop zone
        if (!destination) return;

        // Handle movement from item list to a drop zone
        if (source.droppableId === "items" && destination.droppableId.startsWith("zone")) {
            const destZoneIndex = parseInt(destination.droppableId.split("-")[1]);
            const draggedItemIndex = source.index;
            const availableItems = dragItems.filter(item =>
                !dropZones.some(zone => zone.itemId === item.id));
            const draggedItem = availableItems[draggedItemIndex];

            if (!draggedItem) return;

            const originalIndex = draggedItem.originalIndex;

            // Update drop zones
            const newDropZones = [...dropZones];

            // If the destination zone already had an item, remove it first
            if (newDropZones[destZoneIndex].itemId) {
                // No need to explicitly clear it as we'll overwrite it
            }

            newDropZones[destZoneIndex] = {
                ...newDropZones[destZoneIndex],
                itemId: draggedItem.id
            };

            setDropZones(newDropZones);

            // Update parent component's answer state
            const newAnswer = [...(answer || Array(newDropZones.length).fill(""))];
            newAnswer[destZoneIndex] = originalIndex.toString();
            onAnswerChange(newAnswer);
        }

        // Handle movement from one drop zone to another
        else if (source.droppableId.startsWith("zone") && destination.droppableId.startsWith("zone")) {
            const sourceZoneIndex = parseInt(source.droppableId.split("-")[1]);
            const destZoneIndex = parseInt(destination.droppableId.split("-")[1]);

            // Get the item IDs in both zones
            const sourceItemId = dropZones[sourceZoneIndex].itemId;
            const destItemId = dropZones[destZoneIndex].itemId;

            if (!sourceItemId) return;

            // Find the original indices for these items
            const sourceItem = dragItems.find(item => item.id === sourceItemId);
            const destItem = dragItems.find(item => item.id === destItemId);

            if (!sourceItem) return;

            // Create new drop zones with swapped items
            const newDropZones = [...dropZones];
            newDropZones[sourceZoneIndex].itemId = destItemId;
            newDropZones[destZoneIndex].itemId = sourceItemId;
            setDropZones(newDropZones);

            // Update parent component's answer state
            const newAnswer = [...(answer || Array(newDropZones.length).fill(""))];
            newAnswer[sourceZoneIndex] = destItem ? destItem.originalIndex.toString() : "";
            newAnswer[destZoneIndex] = sourceItem.originalIndex.toString();
            onAnswerChange(newAnswer);
        }

        // Handle movement from a drop zone back to the item list
        else if (source.droppableId.startsWith("zone") && destination.droppableId === "items") {
            const zoneIndex = parseInt(source.droppableId.split("-")[1]);

            // Clear the source zone
            const newDropZones = [...dropZones];
            newDropZones[zoneIndex].itemId = null;
            setDropZones(newDropZones);

            // Update parent component's answer state
            const newAnswer = [...(answer || Array(newDropZones.length).fill(""))];
            newAnswer[zoneIndex] = "";
            onAnswerChange(newAnswer);
        }
    };

    // Get item data by ID
    const getItemById = (itemId) => {
        return dragItems.find(item => item.id === itemId);
    };

    // Filter items that aren't currently in drop zones
    const getAvailableItems = () => {
        return dragItems.filter(item =>
            !dropZones.some(zone => zone.itemId === item.id)
        );
    };

    return (
        <div className="p-2">
            <DragDropContext onDragEnd={handleDragEnd}>
                {/* Drop Zones */}
                <div className="mb-8">
                    <p className="font-medium mb-3">Arrange in correct order:</p>
                    <div className="space-y-3">
                        {dropZones.map((zone, index) => (
                            <Droppable key={zone.id} droppableId={zone.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`p-3 border-2 rounded-lg min-h-16 flex items-center transition-colors
                                        ${snapshot.isDraggingOver ? 'bg-blue-50 border-blue-300' :
                                                zone.itemId ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}
                                    >
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-medium mr-3">
                                            {index + 1}
                                        </div>

                                        {zone.itemId ? (
                                            <Draggable
                                                draggableId={zone.itemId}
                                                index={0}
                                                key={zone.itemId}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`p-3 bg-white border rounded-md flex-1 ${snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                                                            }`}
                                                    >
                                                        {getItemById(zone.itemId)?.content}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ) : (
                                            <div className="text-gray-400 flex-1">Drop item here</div>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </div>

                {/* Draggable Items */}
                <div className="mt-6">
                    <p className="font-medium mb-3">Available items:</p>
                    <Droppable droppableId="items" direction="horizontal">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex flex-wrap gap-2 p-4 border-2 rounded-lg min-h-16
                                ${snapshot.isDraggingOver ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-300'}`}
                            >
                                {getAvailableItems().map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`p-3 bg-white border rounded-md ${snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                                                    }`}
                                            >
                                                {item.content}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </div>
    );
};

export default DragDropQuestion;
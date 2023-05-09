import { Box, Button, Typography, Divider, TextField, IconButton, Card } from '@mui/material'
import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import ColumnTask from '../../components/ColumnTask/ColumnTask'

const columnTaskDumb = [
    {
        "_id": "612bfc4ba4cb6842a329a244",
        "name": "To Do",
        "position": 0,
        "task": [
            {
                "_id": "612bfc4ba4cb6842a329a247",
                "title": "Task 1",
                "description": "Description for task 1",
                "position": 0,
                "column_id": "612bfc4ba4cb6842a329a244"
            },
            {
                "_id": "612bfc4ba4cb6842a329a248",
                "title": "Task 2",
                "description": "Description for task 2",
                "position": 1,
                "column_id": "612bfc4ba4cb6842a329a244"
            },]
    },
    {
        "_id": "612bfc4ba4cb6842a329a245",
        "name": "Doing",
        "position": 1,
        "task": [
            {
                "_id": "612bfc4ba4cb6842a329a249",
                "title": "Task 3",
                "description": "Description for task 3",
                "position": 0,
                "column_id": "612bfc4ba4cb6842a329a245"
            }
        ]
    },
    {
        "_id": "612bfc4ba4cb6842a329a246",
        "name": "Done",
        "position": 2,
        "task": []
    }
]

const Todo = () => {
    const [columnTask, setColumnTask] = useState(columnTaskDumb)
    const [selectedTask, setSelectedTask] = useState(undefined)


    const onDragEnd = async ({ source, destination, type }) => {
        console.log(source, destination, type)
        if (!destination) return

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (type === "column") {
            console.log("column")
        }

        const sourceColIndex = columnTask.findIndex(e => e._id === source.droppableId)
        const destinationColIndex = columnTask.findIndex(e => e._id === destination.droppableId)
        const sourceCol = columnTask[sourceColIndex]
        const destinationCol = columnTask[destinationColIndex]

        const sourceSectionId = sourceCol._id
        const destinationSectionId = destinationCol._id

        const sourceTasks = [...sourceCol.task]
        const destinationTasks = [...destinationCol.task]

        if (source.droppableId !== destination.droppableId) {
            const [removed] = sourceTasks.splice(source.index, 1)
            destinationTasks.splice(destination.index, 0, removed)
            columnTask[sourceColIndex].task = sourceTasks
            columnTask[destinationColIndex].task = destinationTasks
        } else {
            const [removed] = destinationTasks.splice(source.index, 1)
            destinationTasks.splice(destination.index, 0, removed)
            columnTask[destinationColIndex].task = destinationTasks
        }

        try {
            // await taskApi.updatePosition(boardId, {
            //     resourceList: sourceTasks,
            //     destinationList: destinationTasks,
            //     resourceSectionId: sourceSectionId,
            //     destinationSectionId: destinationSectionId
            // })
            // setColumnTask(columnTask)
        } catch (err) {
            alert(err)
        }
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Button
                // onClick={createSection}
                >
                    Add section
                </Button>
                <Typography variant='body2' fontWeight='700'>
                    {columnTask.length} Sections
                </Typography>
            </Box>
            <Divider sx={{ margin: '10px 0' }} />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-column" type="column" direction="horizontal">
                    {(provided, snapshot) => (
                        <Box
                            isDraggingOver={snapshot.isDraggingOver}
                            {...provided.droppableProps}
                            ref={provided.innerRef}

                            sx={{
                                display: 'flex',
                                // alignItems: 'flex-start',
                                width: '90vw',
                                overflowX: 'auto'
                            }}>
                            {
                                columnTask.map((section, index) => (
                                    <ColumnTask column={section} index={index} key={section._id} />
                                ))
                            }
                        </Box>
                    )}


                </Droppable>

            </DragDropContext>
        </>
    )
}

export default Todo
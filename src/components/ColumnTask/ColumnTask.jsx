import { Box, Card, IconButton, Paper, TextField, Typography, makeStyles } from '@mui/material';
import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

const ColumnTask = ({ column, index }) => {

  return (
    <Draggable key={column._id} draggableId={column._id} index={index} type="column">
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{ width: '300px', padding: '10px', marginRight: '10px' }}
        >
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>

            <TextField
              // style={{ cursor: "grab" }}
              value={column.name}
              // onChange={(e) => updateSectionTitle(e, section.id)}
              placeholder='Untitled'
              variant='outlined'
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-input': { padding: 0 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                '& .MuiOutlinedInput-root': { fontSize: '1rem', fontWeight: '700' }
              }}
            />
            <IconButton
              variant='outlined'
              size='small'
              sx={{
                color: 'gray',
                '&:hover': { color: 'green' }
              }}
            // onClick={() => createTask(section.id)}
            >
              <AddOutlinedIcon />
            </IconButton>
            <IconButton
              variant='outlined'
              size='small'
              sx={{
                color: 'gray',
                '&:hover': { color: 'red' }
              }}
            // onClick={() => deleteSection(section.id)}
            >
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
          <Droppable droppableId={column._id} type="task">
            {(provided, snapshot) => (
              <div className="task-list" style={{
                padding: 8,
                flexGrow: 1,
                minHeight: 100,
                transition: "background-color ease 0.2s",
                backgroundColor: props =>
                  props.isDraggingOver ? "palevioletred" : "white"
              }}
                isDraggingOver={snapshot.isDraggingOver}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {
                  column.task.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index} >
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            padding: '10px',
                            marginBottom: '10px',
                            cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                          }}
                        // onClick={() => setSelectedTask(task)}
                        >
                          <Typography>
                            {task.title === '' ? 'Untitled' : task.title}
                          </Typography>
                        </Card>
                      )}
                    </Draggable>
                  ))
                }
              </div>
            )}

          </Droppable>


          {provided.placeholder}
        </Card>
      )
      }
    </Draggable >
  )
}

export default ColumnTask

import React, {useState, useEffect} from 'react';
import './App.css';

// Interim unique ids
let _taskUid = 1;
function createTaskId() {
  return _taskUid++;
}

function TaskEdit({setNewTask, onNewTaskSubmit, newTaskInput}) {
  return (
    <div className='task-edit'>
      <textarea
        className='task'
        ref={newTaskInput}
        placeholder={'Enter a title for this card'}
      ></textarea>
      <div className="task-actions">
        <button className='task-edit-actions-add' onClick={() => onNewTaskSubmit()}>Add card</button>
        <button onClick={() => setNewTask(false)}>Cancel</button>
      </div>
    </div>
  )
}

function Panel({
  title, 
  panelId, 
  tasks, 
  newTask, 
  setNewTask, 
  newTaskInput, 
  onNewTaskSubmit,
  setDragTask,
  onTaskDrop
}) {
  return (
    <div 
      className='panel'
      onDragOver={(e) => { e.preventDefault() }}
      onDrop={(e) => { onTaskDrop(panelId) }}
    >
      <h2>{title}</h2>
      <ul>
        {tasks.map((task) => {
          return (
            <li 
              key={task.taskId}
              className='task'
              draggable={true}
              onDragStart={() => setDragTask(task)}
              onDragOver={(e) => { e.preventDefault() }}
              onDrop={(e) => { 
                e.stopPropagation();
                onTaskDrop(panelId, task);
              }}
            >
              {task.text}
            </li>
          )
        })}
      </ul>
      {newTask === panelId && (
        <TaskEdit 
          setNewTask={setNewTask}
          newTaskInput={newTaskInput}
          onNewTaskSubmit={onNewTaskSubmit}
        />
      )}
      {newTask === false && (
        <div className='panel-end task-actions'>
          <button onClick={() => setNewTask(panelId)}>
            + Add a card
          </button>
        </div>
      )}
    </div>
  )
}

function App() {
  const panels = [
    {'title': 'To Do', panelId: 1},
    {'title': 'In Progress', panelId: 2},
    {'title': 'QA', panelId: 3},
    {'title': 'Done', panelId: 4},
  ];

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(false); // false | panelId
  const [dragTask, setDragTask] = useState(false); // false | task{}
  const newTaskInput = React.createRef();

  function onNewTaskSubmit() {
    if (newTaskInput.current.value === '') {
      window.alert('Please fill in the task');
      return;
    }
    setTasks([...tasks, {
      text: newTaskInput.current.value, 
      panelId: newTask, 
      taskId: createTaskId()
    }]);
    setNewTask(false);
  }

  function onTaskDrop(panelId, beforeTask) {
    const workingTasks = tasks.filter(t => t.taskId !== dragTask.taskId);

    // Drop append to panel
    if (beforeTask === undefined) {
      setTasks([
        ...workingTasks,
        { ...dragTask, panelId }
      ]);
      return;
    }

    // Drop prepending other task
    workingTasks.splice(workingTasks.indexOf(beforeTask), 0, { ...dragTask, panelId });
    setTasks(workingTasks);
  }

  // Fill some initial tasks
  useEffect(() => {
    setTasks([
      { text: 'Gather stakeholder feedback', panelId: 1, taskId: createTaskId() },
      { text: 'Write reqs', panelId: 2, taskId: createTaskId() },
      { text: 'Resourcing', panelId: 3, taskId: createTaskId() },
      { text: 'Design proto', panelId: 3, taskId: createTaskId() },
      { text: 'API', panelId: 3, taskId: createTaskId() },
    ]);
  }, []);

  return (
    <div className="panels">
      {panels.map(panel => (
        <Panel
          key={panel.panelId}
          panelId={panel.panelId}
          title={panel.title}
          tasks={tasks.filter(t => t.panelId === panel.panelId)}
          newTask={newTask}
          setNewTask={setNewTask}
          newTaskInput={newTaskInput}
          onNewTaskSubmit={onNewTaskSubmit}
          setDragTask={setDragTask}
          onTaskDrop={onTaskDrop}
        />
      ))}
    </div>
  );
}

export default App;

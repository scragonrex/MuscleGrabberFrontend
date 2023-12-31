import React, { useEffect, useState } from 'react'
import '../styles/Goals.css'
import { Accordion, AccordionDetails, AccordionSummary, Alert, Checkbox, FormControlLabel, Snackbar } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setScore } from '../store/authSlice';


const GoalsList = ({ item, index, getGoals }) => {
  const [tasks, setTasks] = useState(item.progress.length);
  const [change, setChange] = useState(false);
  const [progressList, setProgressList] = useState(item.progress);
  const url = useSelector((state)=>state.auth.url);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

   //--------------------------Alert---------------------------//
   const [alert, setAlert] = useState({status:"",open:false, message:""});
   const handleAlertClose = (event, reason) => {
     if (reason === 'clickaway') {
       return;
     }
 
     setAlert({...alert,open:false});
   };
 
  const handleTaskChange = (e) => {
    const id = document.getElementById(`barCont${index}`);
    const ele = e.target.name;
    if (progressList.length > 0 && progressList.includes(ele)) {
      const temp = progressList.filter((item) => item !== ele);
      setProgressList(temp);
    }
    else {
      const temp = progressList.concat(ele);
      setProgressList(temp);
    }

    if (e.target.checked) {

      setTasks(tasks + 1);
      console.log(((tasks + 1) / 7) * 100);
      id.style.width = `${((tasks + 1) / 7) * 100}%`;
    }
    else {
      setTasks(tasks - 1);
      console.log(((tasks - 1) / 7) * 100);
      id.style.width = `${((tasks - 1) / 7) * 100}%`;
    }
    setChange(true);
  }

  const handleDate = (date, num) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + num);
    const temp = newDate.getDate() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getFullYear();
    return temp;
  }

  const handleFinalSubmit = async () => {
    if (change === false)
      return;

    console.log("progresslist", progressList)

    const response = await fetch(`${url}/goals/addScore`, {
      method: "POST",
      body: JSON.stringify({ score: Math.ceil((tasks / 7) * 100), newProgress: progressList, goalId: item._id }),
      headers: { Authorization: `Bearer ${token}`, "Content-type": "application/json" }
    });

    const data = await response.json();
    if (data.status === "success") {
      
      dispatch(setScore({
        score: data.score
      }))
      getGoals();
    }
    setAlert({status:data.status,open:true, message:data.msg})
    console.log(data);
  }

  const handleDeleteGoal = async()=>{
    const response = await fetch(`${url}/goals/deleteGoal`,{
      method:"DELETE",
      body:JSON.stringify({goalId: item._id}),
      headers:{Authorization:`Bearer ${token}`, "Content-type":"application/json"}
    });

    const data =await response.json();
    if(data.status==="success")
    {getGoals();}
    setAlert({open:true, status:data.status, message:data.msg});
  }
 

  
  useEffect(() => {
    const id = document.getElementById(`barCont${index}`);
    id.style.width = `${((tasks) / 7) * 100}%`;
    // eslint-disable-next-line
  }, [])

  return (
    <div className='goalCont'>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleAlertClose} severity={alert.status} variant='filled' sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
      <Accordion sx={{ 
        backgroundColor:item.status=== "completed" ? "#03311c" : item.status === "not completed" ? "#601826" : "rgb(41 41 41)", color: "white", minHeight: "4.5rem" }}>
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: "white" }} />}
        >
          <div className="barContainer">
            <div className='font-bigger-para'>{item?.excercise}</div>
            <div className='font-bigger-para'>{Math.ceil((tasks / 7) * 100)} % {item.status === "not completed" ? "(Not completed)" : item.status === "completed" && "(completed)"}</div>
            <div id={`barCont${index}`} className="bar"></div>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ 
          backgroundColor:item.status=== "completed" ? "#03311c" : item.status === "not completed" ? "#601826" : "rgb(41 41 41)"
          }}>
            <div className='font-para'>{item?.frequency}</div>
          <div style={{ position: "relative" }}>
            <div className="display-flex-col width-100">
              <FormControlLabel
                value="end"
                control={<Checkbox color='success' checked={progressList.includes('1')} name={'1'} onChange={handleTaskChange} />}
                label={handleDate(item.startDate, 0)}
                labelPlacement="end"
              />
              <FormControlLabel
                value="end"
                control={<Checkbox color='success' checked={progressList.includes('2')} name={'2'} onChange={handleTaskChange} />}
                label={handleDate(item.startDate, 1)}
                labelPlacement="end"
              />
              <FormControlLabel
                value="end"
                control={<Checkbox color='success' checked={progressList.includes('3')} name={'3'} onChange={handleTaskChange} />}
                label={handleDate(item.startDate, 2)}
                labelPlacement="end"
              />
              <FormControlLabel
                value="end"
                control={<Checkbox color='success' checked={progressList.includes('4')} name={'4'} onChange={handleTaskChange} />}
                label={handleDate(item.startDate, 3)}
                labelPlacement="end"
              />
              <FormControlLabel
                value="end"
                control={<Checkbox color='success' checked={progressList.includes('5')} name={'5'} onChange={handleTaskChange} />}
                label={handleDate(item.startDate, 4)}
                labelPlacement="end"
              />
              <FormControlLabel
                value="end"
                control={<Checkbox color='success' checked={progressList.includes('6')} name={'6'} onChange={handleTaskChange} />}
                label={handleDate(item.startDate, 5)}
                labelPlacement="end"
              />
              <FormControlLabel
                value="end"
                control={<Checkbox color='success' checked={progressList.includes('7')} name={'7'} onChange={handleTaskChange} />}
                label={handleDate(item.startDate, 6)}
                labelPlacement="end"
              />

            </div>
            <div style={{ display:"flex", gap:"1em", position: "absolute", right: "0", bottom: "0" }}>
              <button className="btn" onClick={handleFinalSubmit}>Final Submit</button>
              <button className='deleteBtn' onClick={handleDeleteGoal}>Delete</button>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>

  )
}

export default GoalsList; 

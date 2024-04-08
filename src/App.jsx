import { BrowserRouter,Route,Routes } from "react-router-dom";
import Generate from "./assets/Pages/Curp";


function App (){
 return(
<BrowserRouter>
<Routes>
<Route  path="/" element={<Generate/>}/>

</Routes>
</BrowserRouter>


 )



}


export default App;

    import login from './login.js'
    import { goToLogin, isAuthenticated } from '../fn/auth.js'


export default ()=>{
    
    if(!isAuthenticated()) {
        return goToLogin()
    }
    
    return "Hello... world?"
}

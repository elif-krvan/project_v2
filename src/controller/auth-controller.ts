import { Router, Request, Response, NextFunction } from 'express';
import { ILogin } from '../interface/i-login';
import login_validation from '../validation/login-validation';
import BaseRouter from './base-router';
import { ResponseSuccess } from '../common/response-success';
import auth_middleware from '../middleware/auth-middleware';
import { LoginService } from '../service/login-service';

class AuthController implements BaseRouter {
    router: Router;
    loginService: LoginService;

    constructor() {
        this.loginService = new LoginService();
        this.router = Router();
        this.init_controller();
    }
    
    init_controller(): void {
        this.router.post("/login", this.login);
        this.router.get("/test", auth_middleware, this.test);
        this.router.get("/:confirmation_code", this.confirm_user);
    }

    private login = async (req: Request, res: Response, next: NextFunction) => {
        const user_info: ILogin = req.body;
        
        login_validation.user_info_schema.validateAsync((user_info))
        .then((validated_user_info: ILogin) => {
            this.loginService.login(validated_user_info)
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                next(err);
            })            
        })
        .catch((err) => {
            next(err);
        })
    }

    private test = async (req: Request, res: Response) => {
        res.json(new ResponseSuccess("user is authanticated", {msg: "top secret info"}));
    }

    private confirm_user = async (req: Request, res: Response, next: NextFunction) => {
        const code = req.params.confirmation_code;

        login_validation.verification_code_schema.validateAsync(code).then((validated_code: string) => {
            this.loginService.confirm_user(validated_code).then((result) => {
                res.json(result);
            })
            .catch((err) => {
                next(err);
            });
        })
        .catch((err) => {
            next(err);
        });
    }
}

const auth_controller = new AuthController();
export default auth_controller.router;
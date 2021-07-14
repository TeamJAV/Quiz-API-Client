import LandingPage from "../../pages/commons/LandingPage";
import TLogin from "../../pages/teachers/TLogin";
import TSignUp from "../../pages/teachers/TSignUp";
import SLogin from "../../pages/students/SLogin";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import NotFound from "../../pages/commons/NotFound";

const RouteWithSubRoutes = (route) => {
    return (
        <Route
            {...route?.exact}
            path={route.path}
            render={(props) => {
                return (
                    // pass the sub-routes down to keep nesting
                    <route.component {...props} routes={route.routes} />
                );
            }}
        />
    );
};

const ComponentWithSubRoutesWrapper = ({ routes }) => {
    return (
        <Switch>
            {routes.map((route, i) => (
                <RouteWithSubRoutes key={i} {...route} />
            ))}
        </Switch>
    );
};

const paths = {
    notMatch: "*",
    home: "/",
    login: "/login",
    studentLogin: "/login/student",
    teacherLogin: "/login/teacher",
    teacherRegister: "/login/teacher/register",
};

const routes = [
    {
        path: paths.studentLogin,
        component: SLogin,
    },
    {
        path: paths.teacherRegister,
        component: TSignUp,
    },
    {
        path: paths.teacherLogin,
        component: TLogin,
    },
    {
        path: paths.login,
        component: LandingPage,
    },
    {
        path: paths.home,
        component: LandingPage,
    },
    {
        path: paths.notMatch,
        component: NotFound,
    },
];

const Router = () => {
    return (
        <BrowserRouter>
            <Switch>
                {routes.map((route, i) => (
                    <RouteWithSubRoutes key={i} {...route} />
                ))}
            </Switch>
        </BrowserRouter>
    );
};

export { Router, paths };

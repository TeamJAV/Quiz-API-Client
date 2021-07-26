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

const routes = [
    {
        path: "/login/student",
        component: SLogin,
    },
    {
        path: "/login/teacher/register",
        component: TSignUp,
    },
    {
        path: "/login/teacher",
        component: TLogin,
    },
    {
        path: "/login",
        component: LandingPage,
    },
    {
        path: "/",
        component: LandingPage,
    },
    {
        path: "*",
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

export default Router;

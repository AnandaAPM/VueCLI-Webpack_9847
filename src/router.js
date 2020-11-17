import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
    return () =>
        import (`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [{
        path: "/",
        name: "admin",
        component: importComponent('DashboardLayout'),
        children: [
            //Dashboard
            {
                path: "/",
                name: "Root",
                component: importComponent('Dashboard'),
            },
            //To do list
            {
                path: "/gd",
                name: "Guided",
                component: importComponent('TodoList/List'),
            },
            //UGD
            {
                path: "/ugd",
                name: "UGD",
                component: importComponent('TodoList/ListUGD'),
            },
            //TGS
            {
                path: "/tugas",
                name: "Tugas",
                component: importComponent('TodoList/ListTugas'),
            },
        ]
    }, ]
});

export default router;
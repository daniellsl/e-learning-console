import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import PeopleIcon from '@material-ui/icons/People';
import StraightenIcon from '@material-ui/icons/Straighten';
import HearingIcon from '@material-ui/icons/Hearing';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import { 
    BrowserRouter as Router, 
    Route, 
    Link, 
    Switch,
    Redirect, 
} from 'react-router-dom';

// Function Import
import Lesson from "./lessons";
import Tuner from "./tuner";
import Support from "./support";
import Metronome from './metronome';
import Keyboard from "./keyboard";
import Interact from './interact';
import Login from './login';
import Error from './error';

const LoginButton = () => {
    return (
        <Button>
            <Link to="/account">Login</Link>
        </Button>
    );
}

const LogoutButton = () => {
    return (
        <Button>
            <Link to="/account">Logout</Link>
        </Button>
    );
}

export default function App() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const navBarFunction =["Lessons", "Tuner", "Metronome", "Keyboard","Interact", "Support"];
    const navBarLink =["/lessons", "/tuner", "/metronome", "/keyboard", "/interact", "/support"];
    let EventEmitter = require('events');
    let myEventEmitter = new EventEmitter();

    myEventEmitter.on('auth', (isLoggedInTemp) => {
        if (isLoggedInTemp) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    });

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const icon = (index) => {
        switch(index) {
            case 0:
                return <MenuBookIcon />;
            case 1:
                return <HearingIcon />;
            case 2:
                return <HourglassFullIcon />;
            case 3:
                return <StraightenIcon />;
            case 4:
                return <PeopleIcon />;
            case 5:
                return <ContactMailIcon />;
            default:
                return <MenuBookIcon />;
        }
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Router>
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        <IconButton 
                            color="inherit" 
                            edge="start" 
                            aria-label="menu"
                            className={clsx(classes.menuButton, open && classes.hide)}
                            onClick={handleDrawerOpen}
                        >
                        <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}></Typography>
                        {isLoggedIn ? <LogoutButton/> : <LoginButton/>}
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        {navBarFunction.map((text, index) => (
                            <ListItem 
                                button key={text}
                                component={Link}
                                to={navBarLink[index]}
                            >
                                <ListItemIcon>{icon(index)}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader} />
                    <div id="content">
                        <Switch>
                            <Route exact path="/">
                                <Redirect to="/lessons" />
                            </Route>
                            <Route path="/lessons" component={Lesson} />
                            <Route path="/tuner" component={Tuner} exact/>
                            <Route path="/support" component={Support} exact/>
                            <Route path="/metronome" component={Metronome} exact/>
                            <Route path="/keyboard" component={Keyboard} exact/>
                            <Route path="/interact" component={Interact} exact/>
                            <Route path="/account" component={() => <Login myEventEmitter={myEventEmitter} />} exact/>
                            <Route component={Error}/>
                        </Switch>
                    </div>
                </main>
            </Router>
        </div>
    );
}

// Style Below
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexGrow: 1,
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    title: {
        flexGrow: 1,
    },
}));
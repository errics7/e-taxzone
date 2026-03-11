import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";

const useStyles = makeStyles((theme) =>
  createStyles({
    nested: {
      paddingLeft: theme.spacing(4),
    },
    listItemText: {
      fontSize: "1em", //Insert your required size
    },
  })
);

export default function ItemSideNavKelas(props) {
  const { locHistory, routeSelcted, text, icon, level = 0 } = props;
  const classes = useStyles();

  return (
    <div
      className={`relative ${
        locHistory === routeSelcted ? "bg-slate-100 bg-opacity-30" : ""
      }`}
    >
      {locHistory === routeSelcted && (
        <div className="bg-red-400 absolute inset-y-0 left-0 w-0.5"></div>
      )}
      <ListItem button className={level === 1 ? classes.nested : null}>
        <ListItemIcon className="transform scale-90">{icon}</ListItemIcon>
        <ListItemText
          primary={text}
          classes={{ primary: classes.listItemText }}
          className="-ml-2.5"
        />
      </ListItem>
    </div>
  );
}

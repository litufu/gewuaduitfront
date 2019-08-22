import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(3),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelect(props) {
  const classes = useStyles();

  return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-simple">{props.lable}</InputLabel>
        <Select
          fullWidth
          value={props.value}
          onChange={event=>props.onChange(event)}
          inputProps={{
            name: 'value',
            id: 'value-simple',
          }}
        >{
            props.objects.map(obj=>(
                <MenuItem value={obj.value} key={obj.value}>{obj.name}</MenuItem>
            ))
        }
        </Select>
      </FormControl>
  );
}

SimpleSelect.propTypes = {
    /**
     * Override or extend the styles applied to the component.
     */
    onChange: PropTypes.func,
    value:PropTypes.string,
    lable:PropTypes.string,
    objects:PropTypes.array,
};
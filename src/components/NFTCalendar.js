import Modal from "./libs/modal";
import Calendar from "react-calendar";
import {useState} from "react";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import moment from "moment";

const NFTCalendar = ({onChange, value, minDate}) => {
    const [visible, setVisible] = useState(false)
    // const [value, onChangeValue] = useState(new Date());
    const onChangeValue = (date) => {
        // console.log("moment(date).format(\"YYYY-MM-DDT HH:mm:ss\")", moment(date).format("YYYY-MM-DDT HH:mm:ss"))
        onChange(date)
        setVisible(false)
    }
    return <div>
        <div className={"flex flex-row justify-center cursor-pointer"} onClick={() => setVisible(true)}>
            <div className={"mr-1"}>
                {moment(value).format("YYYY-MM-DD")}
            </div>
            <CalendarTodayIcon style={{color: "rgb(190, 37, 37)"}}/>
        </div>
        <Modal visible={visible} onClose={() => setVisible(false)} footer={false} header={false}>
            <Calendar
                onChange={onChangeValue}
                value={value}
                minDate={minDate}
            />
        </Modal>
    </div>
}

export default NFTCalendar
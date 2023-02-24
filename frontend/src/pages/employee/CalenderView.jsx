import "smart-webcomponents-react/source/styles/smart.default.css";
import React from "react";
import "./CalenderStyle.css";
import { Scheduler } from "smart-webcomponents-react/scheduler";
import axios from "axios";

class CalenderView extends React.Component {
  constructor(props) {
    super(props);

    this.scheduler = React.createRef();
    this.calendar = React.createRef();
    this.tree = React.createRef();
    this.primaryContainer = React.createRef();
    this.state = {
      bookingData: [],
    };

    const today = new Date(),
      currentDate = today.getDate(),
      currentYear = today.getFullYear(),
      currentMonth = today.getMonth(),
      thanksgiving = (() => {
        const tempDate = new Date(currentYear, 10, 1);
        //4th Thursday of November
        tempDate.setDate(tempDate.getDate() - tempDate.getDay() + 25);
        return tempDate;
      })();

    this.nonworkingDays = this.getPastThreeWeekdays(today.getDay());

    this.data = [
      {
        label: "Brochure Design Review",
        dateStart: new Date(currentYear, currentMonth, 10, 13, 15),
        dateEnd: new Date(currentYear, currentMonth, 12, 16, 15),
      },
      {
        label: "Website Re-Design Plan",
        dateStart: new Date(currentYear, currentMonth, 16, 16, 45),
        dateEnd: new Date(currentYear, currentMonth, 18, 11, 15),
        class: "event",
      },
      {
        label: "Update Sales Strategy Documents",
        dateStart: new Date(currentYear, currentMonth, 2, 12, 0),
        dateEnd: new Date(currentYear, currentMonth, 2, 13, 45),
        class: "event",
        repeat: {
          repeatFreq: "daily",
          repeatInterval: 2,
          repeatEnd: 5,
          exceptions: [
            {
              date: new Date(currentYear, currentMonth, 4, 12, 0),
              label: "Employee on sick leave. Reschedule for next day",
              dateStart: new Date(currentYear, currentMonth, 5),
              dateEnd: new Date(currentYear, currentMonth, 6),
              status: "outOfOffice",
              backgroundColor: "#F06292",
            },
            {
              date: new Date(currentYear, currentMonth, 8, 12, 0),
              label: "Employee on sick leave. Reschedule for next day",
              dateStart: new Date(currentYear, currentMonth, 9),
              dateEnd: new Date(currentYear, currentMonth, 10),
              status: "outOfOffice",
              backgroundColor: "#FFA000",
            },
          ],
        },
      },
      {
        label: "Non-Compete Agreements",
        dateStart: new Date(currentYear, currentMonth, currentDate - 1, 8, 15),
        dateEnd: new Date(currentYear, currentMonth, currentDate - 1, 9, 0),
        status: "outOfOffice",
        class: "event",
      },
      {
        label: "Update NDA Agreement",
        dateStart: new Date(currentYear, currentMonth, currentDate - 2, 11, 45),
        dateEnd: new Date(currentYear, currentMonth, currentDate - 2, 13, 45),
        class: "event",
      },
      {
        label: "Update Employee Files with New NDA",
        dateStart: new Date(currentYear, currentMonth, currentDate + 2, 14, 0),
        dateEnd: new Date(currentYear, currentMonth, currentDate + 2, 16, 45),
        class: "event",
      },
      {
        label: "Approve Hiring of Mark Waterberg",
        dateStart: new Date(currentYear, currentMonth, currentDate + 3, 10, 0),
        dateEnd: new Date(currentYear, currentMonth, currentDate + 3, 11, 15),
        status: "busy",
        class: "event",
      },
      {
        label: "Update Employees Information",
        dateStart: new Date(currentYear, currentMonth, currentDate, 14, 0),
        dateEnd: new Date(currentYear, currentMonth, currentDate, 16, 45),
        class: "event",
        repeat: {
          repeatFreq: "weekly",
          repeatInterval: 2,
          repeatOn: [2, 4],
          repeatEnd: new Date(2021, 5, 24),
        },
      },
      {
        label: "Prepare Shipping Cost Analysis Report",
        dateStart: new Date(currentYear, currentMonth, currentDate + 1, 12, 30),
        dateEnd: new Date(currentYear, currentMonth, currentDate + 1, 13, 30),
        class: "event",
        repeat: {
          repeatFreq: "monthly",
          repeatInterval: 1,
          repeatOn: [new Date(currentYear, currentMonth, currentDate + 1)],
        },
      },
      {
        label: "Provide Feedback on Shippers",
        dateStart: new Date(currentYear, currentMonth, currentDate + 1, 14, 15),
        dateEnd: new Date(currentYear, currentMonth, currentDate + 1, 16, 0),
        status: "tentative",
        class: "event",
      },
      {
        label: "Haircut for Rami sayed",
        dateStart: new Date(currentYear, currentMonth, currentDate - 1, 16, 0),
        dateEnd: new Date(currentYear, currentMonth, currentDate - 1, 17, 0),
        status: "tentative",
        class: "event",
      },
      {
        label: "beard Trim for rami sayed",
        dateStart: new Date(currentYear, currentMonth, currentDate - 1, 17, 0),
        dateEnd: new Date(currentYear, currentMonth, currentDate - 1, 17, 30),
        status: "tentative",
        class: "event",
      },
      {
        label: "Complete Shipper Selection Form",
        dateStart: new Date(currentYear, currentMonth, currentDate - 1, 8, 30),
        dateEnd: new Date(currentYear, currentMonth, currentDate - 1, 10, 0),
        class: "event",
      },
      {
        label: "Upgrade Server Hardware",
        dateStart: new Date(currentYear, currentMonth, currentDate + 1, 12, 0),
        dateEnd: new Date(currentYear, currentMonth, currentDate + 1, 14, 15),
        class: "event",
      },
      {
        label: "Peter's Birthday",
        dateStart: new Date(currentYear, currentMonth, 5),
        dateEnd: new Date(currentYear, currentMonth, 6),
        class: "birthday",
      },
      {
        label: "Michael's Brithday",
        dateStart: new Date(currentYear, currentMonth, 10),
        dateEnd: new Date(currentYear, currentMonth, 11),
        class: "birthday",
      },
      {
        label: "Christina's Birthday",
        dateStart: new Date(currentYear, currentMonth, 20),
        dateEnd: new Date(currentYear, currentMonth, 21),
        class: "birthday",
      },
      {
        label: "Halloween",
        dateStart: new Date(currentYear, 9, 31),
        dateEnd: new Date(currentYear, 9, 32),
        class: "holiday",
      },
      {
        label: "Marry Christmas",
        dateStart: new Date(currentYear, 11, 24),
        dateEnd: new Date(currentYear, 11, 26, 23, 59, 59),
        class: "holiday",
      },
      {
        label: "Thanksgiving",
        dateStart: thanksgiving,
        dateEnd: new Date(currentYear, 10, thanksgiving.getDate() + 1),
        class: "holiday",
      },
      {
        label: "Day after Thanksgiving",
        dateStart: new Date(currentYear, 10, thanksgiving.getDate() + 1),
        dateEnd: new Date(currentYear, 10, thanksgiving.getDate() + 2),
        class: "holiday",
      },
      {
        label: "Indipendence Day",
        dateStart: new Date(currentYear, 6, 4),
        dateEnd: new Date(currentYear, 6, 5),
        class: "holiday",
      },
      {
        label: "New Year's Eve",
        dateStart: new Date(currentYear, 11, 31),
        dateEnd: new Date(currentYear + 1, 0, 1),
        class: "holiday",
      },
    ];
  }

  view = "week";

  views = [
    "day",
    {
      type: "week",
      hideWeekend: true,
    },
    {
      type: "month",
      hideWeekend: true,
    },
    "agenda",
    {
      label: "4 days",
      value: "workWeek",
      type: "week",
      shortcutKey: "X",
      hideWeekend: false,
      hideNonworkingWeekdays: true,
    },
  ];

  firstDayOfWeek = 1;

  disableDateMenu = true;

  currentTimeIndicator = true;

  scrollButtonsPosition = "far";

  getPastThreeWeekdays(weekday) {
    let weekdays = [];

    for (let i = 0; i < 3; i++) {
      weekdays.push((weekday - i + 7) % 7);
    }

    return weekdays;
  }

  updateData(event) {
    const item = event.detail.item,
      data = this.data;

    for (let i = 0; i < data.length; i++) {
      const dataItem = data[i];

      if (dataItem.label === item.label && dataItem.class === item.class) {
        event.type === "itemRemove" ? this.data.splice(i, 1) : data.splice(i, 1, item);
        return;
      }
    }
  }

  handleToggle() {
    const primaryContainer = this.primaryContainer.current,
      scheduler = this.scheduler.current;

    primaryContainer.classList.toggle("collapse");
    scheduler.disableDateMenu = !primaryContainer.classList.contains("collapse");
  }

  addNew() {
    this.scheduler.current.openWindow({
      class: "event",
    });
  }

  handleCalendarChange(event) {
    this.scheduler.current.dateCurrent = event.detail.value;
  }

  handleTreeChange() {
    const tree = this.tree.current;
    let selectedIndexes = tree.selectedIndexes,
      types = [];

    for (let i = 0; i < selectedIndexes.length; i++) {
      tree.getItem(selectedIndexes[i]).then((result) => {
        types.push(result.value);

        if (i === selectedIndexes.length - 1) {
          this.scheduler.current.dataSource = this.data.filter((d) => types.indexOf(d.class) > -1);
        }
      });
    }
  }

  handleDateChange(event) {
    this.calendar.current.selectedDates = [event.detail.value];
  }

  componentDidMount() {
    console.log("Component did mount"); //suggests where react makes the api call
    axios.get(`${process.env.REACT_APP_SERVER_URL}/calendar/`).then((response) => {
      const initalData = response.data.data;
      console.log(initalData);
      const finalData = [];

      /* Take this array and manipulate it so that

        label: "New Year's Eve",
        dateStart: new Date(currentYear, 11, 31),
        dateEnd: new Date(currentYear + 1, 0, 1),
        class: "event", 
        
      */
    });
  }

  render() {
    console.log("render method called");
    return (
      <div>
        <div id="primaryContainer" ref={this.primaryContainer}>
          <div className="content">
            <section id="sideA">
              <div className="button-container">
                <div id="logo"></div>
              </div>
            </section>
            <section id="sideB">
              <Scheduler ref={this.scheduler} id="scheduler" dataSource={this.data} view={this.view} views={this.views} nonworkingDays={this.nonworkingDays} firstDayOfWeek={this.firstDayOfWeek} disableDateMenu={this.disableDateMenu} currentTimeIndicator={this.currentTimeIndicator} scrollButtonsPosition={this.scrollButtonsPosition} onDragEnd={this.updateData.bind(this)} onResizeEnd={this.updateData.bind(this)} onItemUpdate={this.updateData.bind(this)} onItemRemove={this.updateData.bind(this)} onDateChange={this.handleDateChange.bind(this)}></Scheduler>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default CalenderView;

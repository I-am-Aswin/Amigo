import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function TimeTable({ periods, details }) {

	let handleClick = (e) => {
		let keys = Object.keys(periods)
		let key = keys[keys.indexOf(e[0]) - 1];
		details({
			period: e[0],
			cCode: e[1],
			cName: e[2],
			prev: key ? periods[key]["CourseCode"] : undefined
		});
	}

	return (
		<div className="container mt-4">
			<h2>Time Table : </h2>

			<ul className=" periods-list">
				{periods &&
					Object.keys(periods).map((key) => {
						return (
							<li
								key={key}
								className="period-cont border mt-3 pl-5 gap-3"
							>
								<Link className="period text-decoration-none text-start" to="show" onClick={() => {
									handleClick([key, periods[key]["CourseCode"], periods[key]["CourseName"]]);
								}}>
									<div>
										<p>
											{key} . {periods[key]["CourseCode"]}
										</p>
										<p>{periods[key]["CourseName"]}</p>
										<p>Credits: {periods[key]["Credits"]}</p>
									</div>
								</Link>
							</li>
						);
					})}
			</ul>
		</div>
	);
}

TimeTable.propTypes = {
	periods: PropTypes.object.isRequired,
	details: PropTypes.func.isRequired
};

export default TimeTable;

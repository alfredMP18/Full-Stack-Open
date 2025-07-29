import Header from './Header'
import Content from './Content'

const Course = ({ course }) => {

    //reduce transforms array into 1 value
    const total = course.parts.reduce((s, p) => s + p.exercises, 0)

  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
       <p><strong>Total of {total} exercises</strong></p>
    </div>
  )
}

export default Course

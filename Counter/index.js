import React, {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import './index.css'

const ReposList = () => {
  const [repos, setRepos] = useState([])

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc',
        )
        const data = await response.json()
        setRepos(data.items)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }

    fetchRepos()
  }, [])

  return (
    <div className="repo-list">
      {repos.map(repo => (
        <div key={repo.id} className="repo-item">
          <div className="user-avatar">
            <img
              src={repo.owner.avatar_url}
              alt={`${repo.owner.login}'s avatar`}
            />
          </div>
          <div className="repo-details">
            <h3>
              <Link to={`/repo/${repo.owner.login}/${repo.name}`}>
                {repo.name}
              </Link>
            </h3>
            <p>{repo.description}</p>
            <p>Stars: {repo.stargazers_count}</p>
            <p>Forks: {repo.forks_count}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
const RepoDetails = ({match}) => {
  const [repo, setRepo] = useState(null)

  useEffect(() => {
    const {owner, repoName} = match.params
    const fetchRepoDetails = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repoName}`,
        )
        const data = await response.json()
        setRepo(data)
      } catch (error) {
        console.error('Error fetching repo details: ', error)
      }
    }

    fetchRepoDetails()
  }, [match.params])

  if (!repo) {
    return <p>Loading repo details...</p>
  }

  return (
    <div className="repo-details">
      <h2>{repo.name}</h2>
      <p>{repo.description}</p>
      <p>Stars: {repo.stargazers_count}</p>
      <p>Forks: {repo.forks_count}</p>
    </div>
  )
}

const Counter = () => (
  <Router>
    <div className="App">
      <h1>Github Repos Application</h1>
      <Route path="/" exact component={ReposList} />
      <Route path="/repo/:owner/:repoName" component={RepoDetails} />
    </div>
  </Router>
)

export default Counter


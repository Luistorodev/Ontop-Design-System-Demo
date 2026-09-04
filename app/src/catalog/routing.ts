import { useEffect, useState } from 'react'

/* Hash routing rather than a router dependency: the hub needs shareable deep
   links (`#/foundations/colors`) so people can paste a specific token page into
   Slack, but a hash needs no server rewrite and no extra package. */

export function useHashRoute(): string {
  const [path, setPath] = useState(read)

  useEffect(() => {
    const onChange = () => setPath(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return path
}

function read(): string {
  const raw = window.location.hash.replace(/^#/, '')
  return raw.length > 1 ? raw : '/foundations/architecture'
}

export function navigate(path: string) {
  window.location.hash = path
}

const DB_NAME = 'ElCuervoDB'
const DB_VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains('students')) {
        const studentsStore = db.createObjectStore('students', { keyPath: 'id', autoIncrement: true })
        studentsStore.createIndex('name', 'name', { unique: false })
      }
      if (!db.objectStoreNames.contains('activities')) {
        const activitiesStore = db.createObjectStore('activities', { keyPath: 'id', autoIncrement: true })
        activitiesStore.createIndex('studentId', 'studentId', { unique: false })
      }
    }
    request.onsuccess = (e) => resolve(e.target.result)
    request.onerror = (e) => reject(e.target.error)
  })
}

export async function addStudent(student) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('students', 'readwrite')
    const req = tx.objectStore('students').add({ ...student, createdAt: new Date().toISOString() })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function getAllStudents() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('students', 'readonly')
    const req = tx.objectStore('students').getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function addActivity(activity) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('activities', 'readwrite')
    const req = tx.objectStore('activities').add({ ...activity, createdAt: new Date().toISOString() })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function getAllActivities() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('activities', 'readonly')
    const req = tx.objectStore('activities').getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function getActivitiesByStudent(studentId) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('activities', 'readonly')
    const index = tx.objectStore('activities').index('studentId')
    const req = index.getAll(studentId)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

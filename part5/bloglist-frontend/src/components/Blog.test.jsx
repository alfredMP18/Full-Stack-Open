import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('renders title and author but not URL or likes by default', () => {
    const blog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 5
    }

    render(<Blog blog={blog} />)

    expect(screen.getByText('Test Blog Title Test Author')).toBeDefined()
    expect(screen.queryByText('http://test.com')).toBeNull()
    expect(screen.queryByText(/likes/i)).toBeNull()
})

test('clicking the button shows URL and likes', async () => {
    const blog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 5
    }

    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('http://test.com')).toBeDefined()
    expect(screen.getByText(/likes 5/i)).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
    const blog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 5
    }

    const mockChangeBlog = vi.fn()

    render(
        <Blog
        blog={blog}
        changeBlog={mockChangeBlog}
        deleteBlog={() => {}}
        user={{ username: 'testUser' }}
        />
    )

    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockChangeBlog.mock.calls).toHaveLength(2)
})

test('calls createBlog with correct details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://test.com')

    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)

    expect(createBlog.mock.calls[0][0]).toEqual({
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://test.com'
    })
})
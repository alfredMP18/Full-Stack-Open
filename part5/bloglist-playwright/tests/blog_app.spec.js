const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
     
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Tester PW',
        username: 'testerPW',
        password: 'testerPW'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await page.getByTestId('username-input').fill('testerPW')
        await page.getByTestId('password-input').fill('testerPW')
        await page.getByTestId('login-button').click()
        
        await expect(page.getByText('Tester PW logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByTestId('username-input').fill('testerPW')
        await page.getByTestId('password-input').fill('tester')
        await page.getByTestId('login-button').click()

        await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })
})

describe('When logged in', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Tester PW',
        username: 'testerPW',
        password: 'testerPW'
      }
    })
    await page.goto('http://localhost:5173')

    await page.getByTestId('username-input').fill('testerPW')
    await page.getByTestId('password-input').fill('testerPW')
    await page.getByTestId('login-button').click()
  })

  test('a new blog can be created', async ({ page }) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('title-input').fill('Playwright Blog')
    await page.getByTestId('author-input').fill('Tester')
    await page.getByTestId('url-input').fill('http://example.com')
    await page.getByTestId('blogCreate-button').click()

    await expect(page.getByText('a new blog Playwright Blog by Tester added')).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('title-input').fill('Blog to Like')
    await page.getByTestId('author-input').fill('Liker')
    await page.getByTestId('url-input').fill('http://example.com/like')
    await page.getByTestId('blogCreate-button').click()

    await expect(page.getByText('a new blog Blog to Like by Liker added')).toBeVisible()

    const blog = page.locator('.blog').filter({ hasText: 'Blog to Like' })
    await blog.getByRole('button', { name: 'view' }).waitFor({ state: 'visible' })
    await blog.getByRole('button', { name: 'view' }).click()
    
    await expect(blog.locator('[data-testid="likes-count"]')).toContainText('likes 0')

    await blog.getByRole('button', { name: 'like' }).click()

    await expect.poll(async () => {
    return await blog.locator('[data-testid="likes-count"]').innerText()
    }).toContain('likes 1')
  })

    test('a blog can be deleted by its creator', async ({ page }) => {

    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('title-input').fill('Blog to Delete')
    await page.getByTestId('author-input').fill('Remover')
    await page.getByTestId('url-input').fill('http://example.com/delete')
    await page.getByTestId('blogCreate-button').click()

    await expect(page.getByText('a new blog Blog to Delete by Remover added')).toBeVisible()

    const blog = page.locator('.blog').filter({ hasText: 'Blog to Delete' })

    const viewButton = blog.getByRole('button', { name: 'view' })
    await expect(viewButton).toBeVisible()
    await viewButton.click()

    page.once('dialog', async (dialog) => {
        await dialog.accept()
    })

    const removeButton = blog.getByTestId('blogRemove-button')
    await expect(removeButton).toBeVisible()
    await removeButton.click()


    await expect(page.getByText('Blog to Delete')).toHaveCount(0)
    })

})

describe('Blog permissions', () => {
  test('only the creator can see the delete button', async ({ page, request, browser }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Tester PW',
        username: 'testerPW',
        password: 'testerPW',
      },
    })
    await page.goto('http://localhost:5173')

    await page.getByTestId('username-input').fill('testerPW')
    await page.getByTestId('password-input').fill('testerPW')
    await page.getByTestId('login-button').click()

    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('title-input').fill('Blog testerPW')
    await page.getByTestId('author-input').fill('Author 1')
    await page.getByTestId('url-input').fill('http://creator.com')
    await page.getByTestId('blogCreate-button').click()

    await page.getByRole('button', { name: 'logout' }).click()

    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Second User',
        username: 'secondUser',
        password: 'password',
      },
    })

    const context = await browser.newContext()
    const secondPage = await context.newPage()
    await secondPage.goto('http://localhost:5173')

    await secondPage.getByTestId('username-input').fill('secondUser')
    await secondPage.getByTestId('password-input').fill('password')
    await secondPage.getByTestId('login-button').click()

    const blog = secondPage.locator('.blog').filter({ hasText: 'Blog testerPW' })
    await blog.getByRole('button', { name: 'view' }).click()

    await expect(blog.getByTestId('blogRemove-button')).toHaveCount(0)

    await context.close()
  })
})

describe.only('Blog sorting by likes', () => {
  test('blogs are ordered by number of likes', async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Tester PW',
        username: 'testerPW',
        password: 'testerPW',
      },
    })
    await page.goto('http://localhost:5173')

    await page.getByTestId('username-input').fill('testerPW')
    await page.getByTestId('password-input').fill('testerPW')
    await page.getByTestId('login-button').click()

    await expect(page.getByText('Tester PW logged in')).toBeVisible()

    const createBlog = async (title, likes) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title-input').fill(title)
      await page.getByTestId('author-input').fill('Author')
      await page.getByTestId('url-input').fill(`http://example.com/${title}`)
      await page.getByTestId('blogCreate-button').click()

      await expect(page.getByText(`a new blog ${title} by Author added`)).toBeVisible()

      const blog = page.locator('.blog').filter({ hasText: title })
      await blog.getByRole('button', { name: 'view' }).click()

      for (let i = 0; i < likes; i++) {
        await blog.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(100)
      }
    }

    await createBlog('Least Liked Blog', 1)
    await createBlog('Medium Liked Blog', 3)
    await createBlog('Most Liked Blog', 5)

    await page.waitForSelector('.blog')

    const blogTitles = await page.locator('.blog').evaluateAll((blogs) =>
        blogs.map((el) => el.textContent.trim()) 
    )

    console.log('titles', blogTitles)

    expect(blogTitles[0]).toContain('Most Liked Blog')
    expect(blogTitles[1]).toContain('Medium Liked Blog')
    expect(blogTitles[2]).toContain('Least Liked Blog')
  })
})

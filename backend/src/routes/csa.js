export async function getCSA (req, res) {
  let response = await searchSIV(req.body.id, req.body.uuid)
  if (response.status === 200) {
    res.status(200).json({
      success: true,
      status: response.status,
      source: 'siv',
      token: response.token,
      v: response.v,
    })
  } else {
    res.status(response.status).json({
      success: false,
      status: response.status,
      source: 'siv',
      message: response.message,
    })
  }
}

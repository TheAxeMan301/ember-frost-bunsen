export default {
  containers: [{
    id: 'main',
    children: [
      [
        {
          model: 'foo',
          renderer: 'select'
        }
      ]
    ]
  }],
  cells: [
    {
      container: 'main',
      label: 'Main'
    }
  ],
  type: 'form',
  version: '2.0'
}

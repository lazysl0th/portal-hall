class BadRequestErr extends Error {
  constructor(errorTemplate) {
    super(errorTemplate.errorMessage)
    this.usage = 'node cli.js <boxes> <path> [className]',
    this.example = 'node cli.js 3 ./morties/ClassicMorty.js ClassicMorty';
  }

  handler() {
    console.error('Error:', this.message);
    console.error('Usage:', this.usage,);
    console.error('Exapmle:', this.example);
    process.exit(1);
  }
}

exports.BadRequestErr = BadRequestErr
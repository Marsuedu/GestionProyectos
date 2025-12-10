<?php

namespace Tests\Feature\Users;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class DisabledAccessFeatureTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function disabled_user_is_denied_on_protected_routes(): void
    {
        $user = User::factory()->create([
            'email' => 'disabled@example.com',
            'password' => Hash::make('password123'),
            'is_enabled' => false,
        ]);

        $this->actingAs($user);
        $resp1 = $this->get(route('projects.index'));
        $resp2 = $this->get(route('tasks.index'));

        $this->assertTrue(in_array($resp1->getStatusCode(), [302, 403]));
        $this->assertTrue(in_array($resp2->getStatusCode(), [302, 403]));
    }
}

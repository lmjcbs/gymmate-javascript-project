class WorkoutsController < ApplicationController
  def create
    user = User.find_by(id: current_user.userable_id)
    workout = user.workouts.build(workout_params)
    if workout.save
      render json: workout
    end
  end

  def update
    user = User.find_by(id: current_user.userable_id)
    workout = user.workouts.find_by(id: params[:id])
    if workout.update(workout_params)
      render json: workout
    else
      render json: {errors: workout.errors.full_messages }
    end
  end

  def destroy
    user = User.find_by(id: current_user.userable_id)
    workout = user.workouts.find_by(id: params[:id])
    if workout.destroy
      render json: workout
    else
      render json: {errors: ["Content could not be deleted"]}
    end
  end

   private
    def workout_params
      params.permit(:program_id, :complete)
    end
end
